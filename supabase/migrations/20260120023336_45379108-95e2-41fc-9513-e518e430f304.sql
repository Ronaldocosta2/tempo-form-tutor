-- Create storage bucket for exercise videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('exercise-videos', 'exercise-videos', false, 104857600, ARRAY['video/mp4', 'video/quicktime', 'video/mov']);

-- Create RLS policies for the exercise-videos bucket
CREATE POLICY "Users can upload their own videos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'exercise-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'exercise-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'exercise-videos' AND auth.uid()::text = (storage.foldername(name))[1]);