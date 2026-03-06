import { getFieldDepth } from '../get-field-depth';
import { makeGroup, makeText } from './helpers';

describe('getFieldDepth', () => {
  it('returns 0 for a root-level field', () => {
    const a = makeText({ id: 'a' });
    expect(getFieldDepth([a], 'a')).toBe(0);
  });

  it('returns 0 for a root-level group', () => {
    const group = makeGroup({ id: 'group', children: [] });
    expect(getFieldDepth([group], 'group')).toBe(0);
  });

  it('returns 1 for a direct child of a group', () => {
    const child = makeText({ id: 'child' });
    const group = makeGroup({ id: 'group', children: [child] });
    expect(getFieldDepth([group], 'child')).toBe(1);
  });

  it('returns the correct depth for a deeply nested field', () => {
    const deep = makeText({ id: 'deep' });
    const inner = makeGroup({ id: 'inner', children: [deep] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    expect(getFieldDepth([outer], 'deep')).toBe(2);
  });

  it('returns -1 when the field id is not found', () => {
    const a = makeText({ id: 'a' });
    expect(getFieldDepth([a], 'ghost')).toBe(-1);
  });

  it('returns -1 for an empty array', () => {
    expect(getFieldDepth([], 'a')).toBe(-1);
  });

  it('finds the correct field among multiple root-level siblings', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const c = makeText({ id: 'c' });
    expect(getFieldDepth([a, b, c], 'c')).toBe(0);
  });

  it('finds the correct field among multiple children in a group', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const c = makeText({ id: 'c' });
    const group = makeGroup({ id: 'group', children: [a, b, c] });
    expect(getFieldDepth([group], 'c')).toBe(1);
  });

  it('does not confuse depth of fields in sibling groups', () => {
    const child1 = makeText({ id: 'child1' });
    const child2 = makeText({ id: 'child2' });
    const group1 = makeGroup({ id: 'group1', children: [child1] });
    const group2 = makeGroup({ id: 'group2', children: [child2] });
    expect(getFieldDepth([group1, group2], 'child1')).toBe(1);
    expect(getFieldDepth([group1, group2], 'child2')).toBe(1);
  });
});
