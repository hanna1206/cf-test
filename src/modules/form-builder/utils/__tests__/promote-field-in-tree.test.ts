import type {
  Field,
  GroupField,
} from '@/modules/form-builder/form-builder.types';

import { promoteFieldInTree } from '../promote-field-in-tree';
import { makeGroup, makeText } from './helpers';

describe('promoteFieldInTree', () => {
  it('lifts a direct child to be a sibling after its parent', () => {
    const child = makeText({ id: 'child' });
    const group = makeGroup({ id: 'group', children: [child] });
    const result = promoteFieldInTree([group], 'child');
    expect(result.map((f) => f.id)).toEqual(['group', 'child']);
    expect((result[0] as GroupField).children).toHaveLength(0);
  });

  it('inserts the promoted field right after its previous parent', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const group = makeGroup({ id: 'group', children: [a, b] });
    const sibling = makeText({ id: 'sibling' });
    const result = promoteFieldInTree([group, sibling], 'b');
    expect(result.map((f) => f.id)).toEqual(['group', 'b', 'sibling']);
    expect((result[0] as GroupField).children.map((c) => c.id)).toEqual(['a']);
  });

  it('promotes from a deeply nested group', () => {
    const deepChild = makeText({ id: 'deep' });
    const inner = makeGroup({ id: 'inner', children: [deepChild] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const result = promoteFieldInTree([outer], 'deep');
    const outerResult = result[0] as GroupField;
    expect(outerResult.children.map((c) => c.id)).toContain('deep');
    expect((outerResult.children[0] as GroupField).children).toHaveLength(0);
  });

  it('is a no-op for a root-level field', () => {
    const fields: Field[] = [makeText({ id: 'a' }), makeText({ id: 'b' })];
    const result = promoteFieldInTree(fields, 'a');
    expect(result.map((f) => f.id)).toEqual(['a', 'b']);
  });

  it('does not mutate the original array', () => {
    const child = makeText({ id: 'child' });
    const group = makeGroup({ id: 'group', children: [child] });
    const fields: Field[] = [group];
    const snapshot = JSON.stringify(fields);
    promoteFieldInTree(fields, 'child');
    expect(JSON.stringify(fields)).toBe(snapshot);
  });

  it('returns the original array when the field id is not found', () => {
    const fields: Field[] = [
      makeText({ id: 'a' }),
      makeGroup({ id: 'g', children: [] }),
    ];
    const result = promoteFieldInTree(fields, 'ghost');
    expect(result).toEqual(fields);
  });

  it('promotes the first child and keeps the remaining children in order', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const c = makeText({ id: 'c' });
    const group = makeGroup({ id: 'group', children: [a, b, c] });
    const result = promoteFieldInTree([group], 'a');
    expect(result.map((f) => f.id)).toEqual(['group', 'a']);
    expect((result[0] as GroupField).children.map((ch) => ch.id)).toEqual([
      'b',
      'c',
    ]);
  });

  it('promotes a group-type node and preserves its subtree', () => {
    const grandchild = makeText({ id: 'grandchild' });
    const inner = makeGroup({ id: 'inner', children: [grandchild] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const result = promoteFieldInTree([outer], 'inner');
    expect(result.map((f) => f.id)).toEqual(['outer', 'inner']);
    expect((result[0] as GroupField).children).toHaveLength(0);
    expect((result[1] as GroupField).children.map((c) => c.id)).toEqual([
      'grandchild',
    ]);
  });

  it('places the promoted field exactly after its parent in the deeply nested case', () => {
    const deepChild = makeText({ id: 'deep' });
    const inner = makeGroup({ id: 'inner', children: [deepChild] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const result = promoteFieldInTree([outer], 'deep');
    const outerResult = result[0] as GroupField;
    expect(outerResult.children.map((c) => c.id)).toEqual(['inner', 'deep']);
  });

  it('does not affect siblings that come before the parent group', () => {
    const before = makeText({ id: 'before' });
    const child = makeText({ id: 'child' });
    const group = makeGroup({ id: 'group', children: [child] });
    const after = makeText({ id: 'after' });
    const result = promoteFieldInTree([before, group, after], 'child');
    expect(result.map((f) => f.id)).toEqual([
      'before',
      'group',
      'child',
      'after',
    ]);
    expect((result[1] as GroupField).children).toHaveLength(0);
  });
});
