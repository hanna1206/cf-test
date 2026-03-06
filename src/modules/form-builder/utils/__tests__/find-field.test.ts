import { findField } from '../find-field';
import { makeGroup, makeText } from './helpers';

describe('find a field', () => {
  it('finds a root-level field', () => {
    const a = makeText({ id: 'a' });
    expect(findField([a], 'a')).toBe(a);
  });

  it('finds a nested field', () => {
    const child = makeText({ id: 'child' });
    const group = makeGroup({ id: 'group', children: [child] });
    expect(findField([group], 'child')).toBe(child);
  });

  it('finds a deeply nested field', () => {
    const deep = makeText({ id: 'deep' });
    const inner = makeGroup({ id: 'inner', children: [deep] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    expect(findField([outer], 'deep')).toBe(deep);
  });

  it('returns null when not found', () => {
    expect(findField([makeText({ id: 'a' })], 'ghost')).toBeNull();
  });

  it('returns null for an empty array', () => {
    expect(findField([], 'a')).toBeNull();
  });

  it('finds a field among multiple root-level siblings', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const c = makeText({ id: 'c' });
    expect(findField([a, b, c], 'c')).toBe(c);
  });

  it('finds a field among multiple children inside a group', () => {
    const child1 = makeText({ id: 'child1' });
    const child2 = makeText({ id: 'child2' });
    const child3 = makeText({ id: 'child3' });
    const group = makeGroup({
      id: 'group',
      children: [child1, child2, child3],
    });
    expect(findField([group], 'child3')).toBe(child3);
  });

  it('finds a group field by its own id without descending into children', () => {
    const child = makeText({ id: 'child' });
    const group = makeGroup({ id: 'group', children: [child] });
    expect(findField([group], 'group')).toBe(group);
  });
});
