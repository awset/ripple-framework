import { FormKitTypeDefinition } from '@formkit/core'
import {
  createRplFormInput,
  defaultRplFormInputProps,
  inputLibrary
} from './input-utils'

/**
 * Input definition for Ripple tel input.
 * @public
 */
export const tel: FormKitTypeDefinition = {
  /**
   * The actual schema of the input, or a function that returns the schema.
   */
  schema: createRplFormInput({
    $cmp: 'RplFormInput',
    props: {
      ...defaultRplFormInputProps,
      type: 'tel'
    }
  }),
  library: inputLibrary,
  /**
   * The type of node, can be a list, group, or input.
   */
  type: 'input',
  /**
   * The family of inputs this one belongs too. For example "text" and "email"
   * are both part of the "text" family. This is primary used for styling.
   */
  family: 'text',
  /**
   * An array of extra props to accept for this input.
   */
  props: ['maxlength', 'minlength', 'placeholder', 'validationMeta'],
  /**
   * Additional features that should be added to your input
   */
  features: []
}
