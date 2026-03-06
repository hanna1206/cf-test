import { findParentField } from '../find-parent-field';
import { makeGroup, makeText } from './helpers';

describe('findParentField', () => {
  it('returns null for a root-level field', () => {
    const a = makeText({ id: 'a' });
    expect(findParentField([a], 'a')).toBeNull();
  });

  it('returns the direct parent group', () => {
    const child = makeText({ id: 'child' });
    const group = makeGroup({ id: 'group', children: [child] });
    const parent = findParentField([group], 'child');
    expect(parent?.id).toBe('group');
  });

  it('returns the immediate parent for a deeply nested field', () => {
    const deep = makeText({ id: 'deep' });
    const inner = makeGroup({ id: 'inner', children: [deep] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const parent = findParentField([outer], 'deep');
    expect(parent?.id).toBe('inner');
  });

  it('returns undefined when the field id is not found', () => {
    expect(findParentField([makeText({ id: 'a' })], 'ghost')).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    expect(findParentField([], 'a')).toBeUndefined();
  });

  it('finds the parent among multiple root-level siblings', () => {
    const child = makeText({ id: 'child' });
    const groupA = makeGroup({ id: 'groupA', children: [] });
    const groupB = makeGroup({ id: 'groupB', children: [] });
    const groupC = makeGroup({ id: 'groupC', children: [child] });
    const parent = findParentField([groupA, groupB, groupC], 'child');
    expect(parent?.id).toBe('groupC');
  });

  it('finds the parent when target is among multiple children inside a group', () => {
    const child1 = makeText({ id: 'child1' });
    const child2 = makeText({ id: 'child2' });
    const child3 = makeText({ id: 'child3' });
    const group = makeGroup({
      id: 'group',
      children: [child1, child2, child3],
    });
    const parent = findParentField([group], 'child3');
    expect(parent?.id).toBe('group');
  });

  it('returns the correct parent when the target is itself a group', () => {
    const inner = makeGroup({ id: 'inner', children: [] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const parent = findParentField([outer], 'inner');
    expect(parent?.id).toBe('outer');
  });
});
