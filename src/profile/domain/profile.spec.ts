import { Profile } from './profile';

describe('Profile Class', () => {
  let profile: Profile;
  const id = '123';
  const name = 'John Doe';
  const createdAt = new Date('2023-01-01');
  const updatedAt = new Date('2023-01-02');

  beforeEach(() => {
    profile = new Profile(id, name, createdAt, updatedAt);
  });

  it('should create a profile with the correct properties', () => {
    expect(profile.id).toBe(id);
    expect(profile.name).toBe(name);
    expect(profile.createdAt).toEqual(createdAt);
    expect(profile.updatedAt).toEqual(updatedAt);
  });

  it('should return the correct createdAt date', () => {
    expect(profile.createdAt).toEqual(createdAt);
  });

  it('should check if the profile belongs to a user', () => {
    expect(profile.belongsTo(id)).toBe(true);
    expect(profile.belongsTo('456')).toBe(false);
  });
});
