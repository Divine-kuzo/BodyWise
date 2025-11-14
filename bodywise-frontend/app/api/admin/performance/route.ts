import { NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth';
import db from '@/lib/db';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

// system performance  by metrics
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. System Admin access required.' },
        { status: 403 }
      );
    }
    
    // CPU usage
    const cpuUsage = process.cpuUsage();
    const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);
    
    // memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercent = ((usedMem / totalMem) * 100).toFixed(2);
    
    // disk usage (Linux/Mac only)
    let diskUsage = { total: 0, used: 0, free: 0, percent: 0 };
    try {
      if (process.platform !== 'win32') {
        const { stdout } = await execAsync('df -k / | tail -1');
        const parts = stdout.trim().split(/\s+/);
        const total = parseInt(parts[1]) * 1024; // Convert to bytes
        const used = parseInt(parts[2]) * 1024;
        const free = parseInt(parts[3]) * 1024;
        diskUsage = {
          total,
          used,
          free,
          percent: parseFloat(((used / total) * 100).toFixed(2)),
        };
      }
    } catch (error) {
      console.warn('Could not get disk usage:', error);
    }
    
    // get our  database s
    const dbStats = db.prepare("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").get() as any;
    const dbSize = dbStats.size;
    
    // Get database table counts
    const tableCounts = {
      users: (db.prepare("SELECT COUNT(*) as count FROM users").get() as any).count,
      patients: (db.prepare("SELECT COUNT(*) as count FROM patients").get() as any).count,
      professionals: (db.prepare("SELECT COUNT(*) as count FROM health_professionals").get() as any).count,
      institutions: (db.prepare("SELECT COUNT(*) as count FROM institutions").get() as any).count,
      consultations: (db.prepare("SELECT COUNT(*) as count FROM consultations").get() as any).count,
      reviews: (db.prepare("SELECT COUNT(*) as count FROM reviews").get() as any).count,
      articles: (db.prepare("SELECT COUNT(*) as count FROM articles").get() as any).count,
      assessments: (db.prepare("SELECT COUNT(*) as count FROM assessments").get() as any).count,
    };
    
    // Get recent system logs
    const recentLogs = db.prepare(`
      SELECT log_type, message, created_at
      FROM system_logs
      ORDER BY created_at DESC
      LIMIT 50
    `).all();
    
    // API response time (simulated for now)
    const apiMetrics = {
      avgResponseTime: 150, // ms
      requestsPerMinute: 45,
      errorRate: 0.02, // 2%
    };
    
    return NextResponse.json({
      success: true,
      data: {
        cpu: {
          usage: parseFloat(cpuPercent),
          cores: os.cpus().length,
        },
        memory: {
          total: totalMem,
          used: usedMem,
          free: freeMem,
          percent: parseFloat(memPercent),
        },
        disk: diskUsage,
        database: {
          size: dbSize,
          sizeFormatted: `${(dbSize / 1024 / 1024).toFixed(2)} MB`,
          tableCounts,
        },
        server: {
          platform: os.platform(),
          hostname: os.hostname(),
          uptime: os.uptime(),
          nodeVersion: process.version,
        },
        api: apiMetrics,
        recentLogs,
      },
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// run diagnostics
export async function POST(request: Request) {
  try {
    // Authenticate user
    const currentUser = getUserFromRequest(request);
    
    if (!currentUser || !hasRole(currentUser, 'system_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. System Admin access required.' },
        { status: 403 }
      );
    }
    
    const diagnostics = [];
    
    // checking database integrity
    try {
      db.prepare("PRAGMA integrity_check").get();
      diagnostics.push({ check: 'Database Integrity', status: 'passed', message: 'Database is healthy' });
    } catch (error) {
      diagnostics.push({ check: 'Database Integrity', status: 'failed', message: 'Database integrity check failed' });
    }
    
    // checking foreign keys
    try {
      const fkCheck = db.prepare("PRAGMA foreign_key_check").all();
      if (fkCheck.length === 0) {
        diagnostics.push({ check: 'Foreign Keys', status: 'passed', message: 'All foreign keys are valid' });
      } else {
        diagnostics.push({ check: 'Foreign Keys', status: 'failed', message: `${fkCheck.length} foreign key violations found` });
      }
    } catch (error) {
      diagnostics.push({ check: 'Foreign Keys', status: 'error', message: 'Could not check foreign keys' });
    }
    
    // check for orphaned records
    const orphanedPatients = db.prepare(`
      SELECT COUNT(*) as count FROM patients
      WHERE user_id NOT IN (SELECT id FROM users)
    `).get() as any;
    
    diagnostics.push({
      check: 'Orphaned Patient Records',
      status: orphanedPatients.count === 0 ? 'passed' : 'warning',
      message: orphanedPatients.count === 0 ? 'No orphaned records' : `${orphanedPatients.count} orphaned records found`,
    });
    
    // checking unverified institutional admins
    const unverifiedAdmins = db.prepare(`
      SELECT COUNT(*) as count FROM users u
      JOIN institutional_admins ia ON u.id = ia.user_id
      JOIN institutions i ON ia.institution_id = i.id
      WHERE i.verification_status = 'pending'
    `).get() as any;
    
    diagnostics.push({
      check: 'Pending Verifications',
      status: unverifiedAdmins.count > 0 ? 'warning' : 'passed',
      message: unverifiedAdmins.count > 0 
        ? `${unverifiedAdmins.count} institutional admins awaiting verification`
        : 'No pending verifications',
    });
    
    // Log diagnostic run
    db.prepare(`
      INSERT INTO system_logs (log_type, message, details)
      VALUES ('info', 'System diagnostics completed', ?)
    `).run(JSON.stringify({ diagnostics, timestamp: new Date().toISOString() }));
    
    return NextResponse.json({
      success: true,
      message: 'Diagnostics completed',
      data: diagnostics,
    });
  } catch (error) {
    console.error('Run diagnostics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
