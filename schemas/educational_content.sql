Table educational_content {
  content_id int [pk, increment]
  institution_id int [ref: > institutions.institution_id]
  title varchar
  description text
  type varchar
  url varchar
  created_at datetime
  approved boolean // Admin approval
}
