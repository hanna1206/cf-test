import type {
  Field,
  GroupField,
} from '@/modules/form-builder/form-builder.types';

import { deleteFieldFromTree } from '../delete-field-from-tree';
import { makeGroup, makeText } from './helpers';

describe('deleteFieldFromTree', () => {
  it('returns an empty array when called with an empty array', () => {
    const result = deleteFieldFromTree([], 'any-id');
    expect(result).toHaveLength(0);
  });

  it('returns an empty array when the only root-level field is deleted', () => {
    const result = deleteFieldFromTree([makeText({ id: 'a' })], 'a');
    expect(result).toHaveLength(0);
  });

  it('deletes a root-level field leaving the rest intact', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const result = deleteFieldFromTree([a, b], 'a');
    expect(result.map((f) => f.id)).toEqual(['b']);
  });

  it('deletes a nested field from a group that has several children', () => {
    const keep1 = makeText({ id: 'keep1' });
    const target = makeText({ id: 'target' });
    const keep2 = makeText({ id: 'keep2' });
    const group = makeGroup({ id: 'group', children: [keep1, target, keep2] });
    const result = deleteFieldFromTree([group], 'target');
    expect((result[0] as GroupField).children.map((c) => c.id)).toEqual([
      'keep1',
      'keep2',
    ]);
  });

  it('deletes the first child from a multi-child group', () => {
    const first = makeText({ id: 'first' });
    const second = makeText({ id: 'second' });
    const third = makeText({ id: 'third' });
    const group = makeGroup({ id: 'group', children: [first, second, third] });
    const result = deleteFieldFromTree([group], 'first');
    expect((result[0] as GroupField).children.map((c) => c.id)).toEqual([
      'second',
      'third',
    ]);
  });

  it('deletes the last child from a multi-child group', () => {
    const first = makeText({ id: 'first' });
    const second = makeText({ id: 'second' });
    const third = makeText({ id: 'third' });
    const group = makeGroup({ id: 'group', children: [first, second, third] });
    const result = deleteFieldFromTree([group], 'third');
    expect((result[0] as GroupField).children.map((c) => c.id)).toEqual([
      'first',
      'second',
    ]);
  });

  it('deletes a deeply nested field', () => {
    const deep = makeText({ id: 'deep' });
    const inner = makeGroup({ id: 'inner', children: [deep] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const result = deleteFieldFromTree([outer], 'deep');
    const innerResult = (result[0] as GroupField).children[0] as GroupField;
    expect(innerResult.children).toHaveLength(0);
  });

  it('deletes a deeply nested group along with all its descendants', () => {
    const grandchild = makeText({ id: 'grandchild' });
    const inner = makeGroup({ id: 'inner', children: [grandchild] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const result = deleteFieldFromTree([outer], 'inner');
    expect((result[0] as GroupField).children).toHaveLength(0);
  });

  it('deletes a group with multi-level descendants entirely', () => {
    const leaf = makeText({ id: 'leaf' });
    const child = makeGroup({ id: 'child', children: [leaf] });
    const target = makeGroup({ id: 'target', children: [child] });
    const root = makeText({ id: 'root' });
    const result = deleteFieldFromTree([root, target], 'target');
    expect(result.map((f) => f.id)).toEqual(['root']);
  });

  it('deletes a group and all its children', () => {
    const child = makeText({ id: 'child' });
    const group = makeGroup({ id: 'group', children: [child] });
    const root = makeText({ id: 'root' });
    const result = deleteFieldFromTree([root, group], 'group');
    expect(result.map((f) => f.id)).toEqual(['root']);
  });

  it('does not mutate the original array', () => {
    const fields: Field[] = [makeText({ id: 'a' }), makeText({ id: 'b' })];
    const snapshot = [...fields];
    deleteFieldFromTree(fields, 'a');
    expect(fields).toEqual(snapshot);
  });
});
