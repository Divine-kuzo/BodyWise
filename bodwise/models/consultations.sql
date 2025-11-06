Table consultations {
  consultation_id int [pk, increment]
  user_id int [ref: > users.user_id]
  professional_id int [ref: > health_professionals.professional_id]
  scheduled_time datetime
  status varchar
  feedback text [null]
  messages text [null] // store consultation messages if needed
}
