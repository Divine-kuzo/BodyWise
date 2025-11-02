Table health_professionals {
  professional_id int [pk, increment]
  first_name varchar
  last_name varchar
  email varchar
  password varchar
  certification varchar
  specialization varchar
  institution_id int [ref: > institutions.institution_id]
  created_at datetime
}
