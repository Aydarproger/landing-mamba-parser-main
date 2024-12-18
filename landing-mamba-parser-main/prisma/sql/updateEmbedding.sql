update directus_files
set embedding = $2::vector
where directus_files.id = $1::uuid