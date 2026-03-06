import { MAX_NESTING_DEPTH } from '@/modules/form-builder/form-builder.const';
import type {
  Field,
  GroupField,
} from '@/modules/form-builder/form-builder.types';

import { demoteFieldInTree } from '../demote-field-in-tree';
import { makeGroup, makeText } from './helpers';

describe('demoteFieldInTree', () => {
  it('moves a field into the specified group', () => {
    const field = makeText({ id: 'field' });
    const group = makeGroup({ id: 'group', children: [] });
    const result = demoteFieldInTree([field, group], 'field', 'group');
    expect(result).toHaveLength(1);
    const updatedGroup = result[0] as GroupField;
    expect(updatedGroup.children).toHaveLength(1);
    expect(updatedGroup.children[0].id).toBe('field');
  });

  it('demotes a nested field into a sibling group', () => {
    const target = makeText({ id: 'target' });
    const dest = makeGroup({ id: 'dest', children: [] });
    const parent = makeGroup({ id: 'parent', children: [target, dest] });
    const result = demoteFieldInTree([parent], 'target', 'dest');
    const updatedParent = result[0] as GroupField;
    expect(updatedParent.children.map((c) => c.id)).not.toContain('target');
    const updatedDest = updatedParent.children[0] as GroupField;
    expect(updatedDest.children.map((c) => c.id)).toContain('target');
  });

  it('returns the original array when the field id is not found', () => {
    const fields: Field[] = [makeText({ id: 'a' })];
    const result = demoteFieldInTree(fields, 'ghost', 'a');
    expect(result).toEqual(fields);
  });

  it('appends the field after existing children in the destination group', () => {
    const existing = makeText({ id: 'existing' });
    const field = makeText({ id: 'field' });
    const group = makeGroup({ id: 'group', children: [existing] });
    const result = demoteFieldInTree([field, group], 'field', 'group');
    const updatedGroup = result[0] as GroupField;
    expect(updatedGroup.children.map((c) => c.id)).toEqual([
      'existing',
      'field',
    ]);
  });

  it('demotes a group-type field and preserves its children', () => {
    const grandchild = makeText({ id: 'grandchild' });
    const innerGroup = makeGroup({ id: 'inner', children: [grandchild] });
    const outerGroup = makeGroup({ id: 'outer', children: [] });
    const result = demoteFieldInTree(
      [innerGroup, outerGroup],
      'inner',
      'outer',
    );
    expect(result).toHaveLength(1);
    const updatedOuter = result[0] as GroupField;
    expect(updatedOuter.children).toHaveLength(1);
    const movedInner = updatedOuter.children[0] as GroupField;
    expect(movedInner.id).toBe('inner');
    expect(movedInner.children.map((c) => c.id)).toEqual(['grandchild']);
  });

  it('demotes a root-level field into a deeply nested group', () => {
    const field = makeText({ id: 'field' });
    const inner = makeGroup({ id: 'inner', children: [] });
    const outer = makeGroup({ id: 'outer', children: [inner] });
    const result = demoteFieldInTree([field, outer], 'field', 'inner');
    expect(result).toHaveLength(1);
    const updatedOuter = result[0] as GroupField;
    const updatedInner = updatedOuter.children[0] as GroupField;
    expect(updatedInner.children.map((c) => c.id)).toEqual(['field']);
  });

  it('does not mutate the original array', () => {
    const field = makeText({ id: 'field' });
    const group = makeGroup({ id: 'group', children: [] });
    const fields: Field[] = [field, group];
    const snapshot = JSON.stringify(fields);
    demoteFieldInTree(fields, 'field', 'group');
    expect(JSON.stringify(fields)).toBe(snapshot);
  });

  it('returns the original tree when destination group id is not found', () => {
    const field = makeText({ id: 'field' });
    const group = makeGroup({ id: 'group', children: [] });
    const fields: Field[] = [field, group];

    const result = demoteFieldInTree(fields, 'field', 'missing-group');

    expect(result).toEqual(fields);
  });

  it('returns the original tree when destination id points to a non-group field', () => {
    const field = makeText({ id: 'field' });
    const notAGroup = makeText({ id: 'target' });
    const fields: Field[] = [field, notAGroup];

    const result = demoteFieldInTree(fields, 'field', 'target');

    expect(result).toEqual(fields);
  });

  it('returns the original tree when demotion would exceed max depth', () => {
    const movingField = makeText({ id: 'moving' });

    let deepest = makeGroup({ id: 'deepest', children: [] });
    for (let i = MAX_NESTING_DEPTH - 2; i >= 0; i--) {
      deepest = makeGroup({ id: `g-${i}`, children: [deepest] });
    }

    const fields: Field[] = [movingField, deepest];

    const result = demoteFieldInTree(fields, 'moving', 'deepest');

    expect(result).toEqual(fields);
  });
});
