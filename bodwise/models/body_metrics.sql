Table body_metrics {
  metrics_id int [pk, increment]
  user_id int [ref: > users.user_id]
  weight_kg float
  height_cm float
  bmi float
  fat_percentage float [null]
  muscle_percentage float [null]
  recorded_at datetime
}
