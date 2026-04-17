import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useId } from 'react';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import css from './NoteForm.module.css';
import { createNote } from '../../services/noteService';
import type { NoteTag } from '../../types/note';

interface NoteFormProps {
  onAddForm: () => void;
}

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Username too short')
    .max(50, 'Username too long')
    .required('This is a required field!'),
  content: Yup.string().max(500, 'Username too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required(),
});

const initialValues: NoteTag = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({ onAddForm }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onAddForm();
    },
  });

  const fieldId = useId();

  const handleSubmit = (
    values: NoteTag,
    formikHelpers: FormikHelpers<NoteTag>
  ) => {
    mutation.mutateAsync({
      title: values.title,
      content: values.content,
      tag: values.tag,
    });

    formikHelpers.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            as="input"
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onAddForm}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
