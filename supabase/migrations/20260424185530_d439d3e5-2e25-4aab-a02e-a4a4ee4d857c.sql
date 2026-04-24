ALTER TABLE public.posts
ADD COLUMN author_name text,
ADD COLUMN publication_name text,
ADD COLUMN article_page_reference text,
ADD COLUMN external_publication_url text,
ADD COLUMN download_url text;