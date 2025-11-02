Table messages {
  message_id int [pk, increment]
  sender_user_id int [ref: > users.user_id, null]
  sender_professional_id int [ref: > health_professionals.professional_id, null]
  receiver_user_id int [ref: > users.user_id, null]
  receiver_professional_id int [ref: > health_professionals.professional_id, null]
  content text
  sent_at datetime
}
