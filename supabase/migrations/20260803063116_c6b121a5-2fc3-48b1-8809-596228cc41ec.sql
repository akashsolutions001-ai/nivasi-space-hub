CREATE POLICY "profile_pictures_read" ON storage.objects FOR SELECT USING (bucket_id = 'profile-pictures');
CREATE POLICY "profile_pictures_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-pictures');
CREATE POLICY "profile_pictures_update" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-pictures') WITH CHECK (bucket_id = 'profile-pictures');
CREATE POLICY "profile_pictures_delete" ON storage.objects FOR DELETE USING (bucket_id = 'profile-pictures');