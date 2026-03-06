import type {
  Field,
  GroupField,
} from '@/modules/form-builder/form-builder.types';

import { moveFieldInTree } from '../move-field-in-tree';
import { makeGroup, makeText } from './helpers';

describe('moveFieldInTree – root-level', () => {
  it('moves a field up', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const c = makeText({ id: 'c' });
    const result = moveFieldInTree([a, b, c], 'b', 'up');
    expect(result.map((f) => f.id)).toEqual(['b', 'a', 'c']);
  });

  it('moves a field down', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const c = makeText({ id: 'c' });
    const result = moveFieldInTree([a, b, c], 'b', 'down');
    expect(result.map((f) => f.id)).toEqual(['a', 'c', 'b']);
  });

  it('keeps the order unchanged when moving the first field up', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const result = moveFieldInTree([a, b], 'a', 'up');
    expect(result.map((f) => f.id)).toEqual(['a', 'b']);
  });

  it('keeps the order unchanged when moving the last field down', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const result = moveFieldInTree([a, b], 'b', 'down');
    expect(result.map((f) => f.id)).toEqual(['a', 'b']);
  });

  it('does not mutate the original array', () => {
    const fields: Field[] = [makeText({ id: 'a' }), makeText({ id: 'b' })];
    const snapshot = [...fields];
    moveFieldInTree(fields, 'b', 'up');
    expect(fields).toEqual(snapshot);
  });

  it('keeps the order unchanged for a single-element array', () => {
    const a = makeText({ id: 'a' });
    const resultUp = moveFieldInTree([a], 'a', 'up');
    const resultDown = moveFieldInTree([a], 'a', 'down');
    expect(resultUp.map((f) => f.id)).toEqual(['a']);
    expect(resultDown.map((f) => f.id)).toEqual(['a']);
  });
});

describe('moveFieldInTree – nested', () => {
  it('moves a field inside a group', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const group = makeGroup({ id: 'g', children: [a, b] });
    const result = moveFieldInTree([group], 'b', 'up');
    const updatedGroup = result[0] as GroupField;
    expect(updatedGroup.children.map((f) => f.id)).toEqual(['b', 'a']);
  });

  it('does not affect other levels when moving within a group', () => {
    const root = makeText({ id: 'root' });
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const group = makeGroup({ id: 'g', children: [a, b] });
    const result = moveFieldInTree([root, group], 'a', 'down');
    expect(result[0].id).toBe('root');
    const updatedGroup = result[1] as GroupField;
    expect(updatedGroup.children.map((f) => f.id)).toEqual(['b', 'a']);
  });

  it('returns the original array when the id is not found', () => {
    const fields: Field[] = [makeText({ id: 'a' })];
    const result = moveFieldInTree(fields, 'ghost', 'up');
    expect(result).toEqual(fields);
  });

  it('moves a field inside a deeply nested group', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const inner = makeGroup({ id: 'inner', children: [a, b] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const result = moveFieldInTree([outer], 'b', 'up');
    const updatedOuter = result[0] as GroupField;
    const updatedInner = updatedOuter.children[0] as GroupField;
    expect(updatedInner.children.map((f) => f.id)).toEqual(['b', 'a']);
  });

  it('keeps the children order unchanged when moving the first child up inside a group', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const group = makeGroup({ id: 'g', children: [a, b] });
    const result = moveFieldInTree([group], 'a', 'up');
    const updatedGroup = result[0] as GroupField;
    expect(updatedGroup.children.map((f) => f.id)).toEqual(['a', 'b']);
  });

  it('does not mutate the original group or its children array', () => {
    const a = makeText({ id: 'a' });
    const b = makeText({ id: 'b' });
    const group = makeGroup({ id: 'g', children: [a, b] });
    const fields: Field[] = [group];
    const originalChildren = [...group.children];
    moveFieldInTree(fields, 'b', 'up');
    expect(group.children).toEqual(originalChildren);
    expect(fields[0]).toBe(group);
  });
});
