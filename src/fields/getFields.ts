import type { GroupField, TextField } from 'payload/dist/fields/config/types';
import type { CollectionConfig, Field } from 'payload/types';

import { BLURHASH_FIELD_NAME } from '../constants';

export const getFields = (collection: CollectionConfig): Field[] => {
  const baseBlurHashField: Field = {
    name: BLURHASH_FIELD_NAME,
    label: 'BlurHash',
    type: 'text',
    required: false,
    localized: false,
    admin: {
      readOnly: true,
      hidden: true,
      condition: (data) => Boolean((data || {})[BLURHASH_FIELD_NAME]?.length || 0),
    },
  };

  const fields = [...collection.fields];

  // Inject a hook into all blurhash fields to generate blurhashes

  let existingBlurHashFieldIndex = -1;

  const existingBlurHashField = fields.find((existingField, i) => {
    if ('name' in existingField && existingField.name === BLURHASH_FIELD_NAME) {
      existingBlurHashFieldIndex = i;

      return true;
    }

    return false;
  }) as TextField;

  if (existingBlurHashFieldIndex > -1) fields.splice(existingBlurHashFieldIndex, 1);

  fields.push({
    ...baseBlurHashField,
    ...(existingBlurHashField || {}),
  });

  if (typeof collection.upload === 'object' && collection.upload.imageSizes) {
    let existingSizesFieldIndex = -1;

    const existingSizesField = fields.find((existingField, i) => {
      if ('name' in existingField && existingField.name === 'sizes') {
        existingSizesFieldIndex = i;

        return true;
      }

      return false;
    }) as GroupField;

    if (existingSizesFieldIndex > -1) fields.splice(existingSizesFieldIndex, 1);

    const sizesField: Field = {
      ...(existingSizesField || {}),
      name: 'sizes',
      type: 'group',
      admin: {
        hidden: true,
      },
      fields: collection.upload.imageSizes.map((size) => {
        const existingSizeField = existingSizesField?.fields.find(
          (existingField) => 'name' in existingField && existingField.name === size.name,
        ) as GroupField;

        const existingSizeBlurHashField = existingSizeField?.fields.find(
          (existingField) => 'name' in existingField && existingField.name === BLURHASH_FIELD_NAME,
        ) as GroupField;

        return {
          ...existingSizeField,
          name: size.name,
          type: 'group',
          fields: [
            {
              ...(existingSizeBlurHashField || {}),
              ...baseBlurHashField,
            },
          ],
        };
      }),
    };

    fields.push(sizesField);
  }

  return fields;
};
