import dotenv from 'dotenv';
dotenv.config();

import * as courseService from './services/courseService.js';
import * as ratingService from './services/ratingService.js';

export async function test() {
  try {
    console.log('--- Creating Course ---');
    const newCourse = await courseService.createCourse({
      title: 'Test Course',
      slug: 'test-course',
      description: 'A test course created via service test'
    });
    console.log('Created:', newCourse);

    console.log('\n--- Listing Courses ---');
    const list = await courseService.listCourses({});
    console.log('Total courses:', list.count);

    console.log('\n--- Get Course by slug ---');
    const course = await courseService.getCourseByIdOrSlug(newCourse.slug);
    console.log('Fetched:', course.title);

    console.log('\n--- Updating Course ---');
    const updated = await courseService.updateCourse(newCourse.id, { subtitle: 'Updated subtitle' });
    console.log('Updated:', updated);

    console.log('\n--- Adding Rating ---');
    const rating = await ratingService.addOrUpdateRating({
      user_id: 1,          // make sure this user exists in `users` table
      course_id: newCourse.id,
      rating: 5,
      review: 'Awesome!'
    });
    console.log('Rating upserted:', rating);

    console.log('\n--- Get Ratings for Course ---');
    const ratings = await ratingService.getRatingsForCourse(newCourse.id);
    console.log('Ratings:', ratings);

    console.log('\n--- Deleting Course ---');
    const deleted = await courseService.deleteCourse(newCourse.id);
    console.log('Deleted:', deleted);

    console.log('\nAll service tests executed ✅');
  } catch (err) {
    console.error('Test failed ❌', err);
  }
}


