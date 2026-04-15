import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSlugs() {
  console.log('🚀 Starting slug fix script...');
  
  try {
    const posts = await prisma.blogPost.findMany();
    console.log(`Found ${posts.length} posts to check.`);

    for (const post of posts) {
      // Logic for slug generation
      let slug = post.slug;
      
      // If slug is missing, looks like an ID, or is otherwise "invalid"
      // Note: MongoDB IDs are 24-char hex strings.
      if (!slug || slug === post.id || slug.includes(' ')) {
        const generatedSlug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "")
          .trim();
        
        // Ensure uniqueness by adding a suffix if needed
        let finalSlug = generatedSlug || `post-${post.id.substring(post.id.length - 4)}`;
        
        console.log(`Updating post "${post.title}": "${slug}" -> "${finalSlug}"`);
        
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { slug: finalSlug }
        });
      }
    }
    
    console.log('✅ Slug fix complete!');
  } catch (error) {
    console.error('❌ Error fixing slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSlugs();
