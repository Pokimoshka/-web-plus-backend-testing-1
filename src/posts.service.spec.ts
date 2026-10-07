import { Post, PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;
  const post: Omit<Post, 'id' | 'date'> = {
    text: 'Mocked post',
  };

  beforeEach(async () => {
    postsService = new PostsService();

    postsService.create({ text: 'Some pre-existing post' });
  });

  it('should add a new post', () => {
    const createdPost = postsService.create(post);

    expect(createdPost).toEqual({
      id: '2',
      text: post.text,
      date: expect.any(String),
    });

    expect(createdPost.text).toBe(post.text);
    expect(createdPost.id).toBe('2');
    expect(new Date(createdPost.date).toISOString()).toBe(createdPost.date);

    const allPosts = (postsService as any).posts as Post[];

    expect(allPosts).toHaveLength(2);
    expect(allPosts[0]).toMatchObject({ text: 'Some pre-existing post' });
    expect(allPosts[1]).toEqual(createdPost);
  });

  it('should find a post', () => {
    const createdPost = postsService.create(post);

    const foundPost = postsService.find(createdPost.id);

    expect(foundPost).toEqual(createdPost);
    expect(foundPost).toMatchObject({
      id: createdPost.id,
      text: post.text,
      date: createdPost.date,
    });

    const preExistingPost = postsService.find('1');

    expect(preExistingPost).toMatchObject({
      id: '1',
      text: 'Some pre-existing post',
    });

    expect(postsService.find('non-existing-id')).toBeUndefined();
  });
});