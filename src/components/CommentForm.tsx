import styled from "@emotion/styled";

const Form = styled.form`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid #dadada;
  border-radius: 6px;
  font: inherit;

  &:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

interface CommentFormProps {
  label: string;
  submitLabel: string;
  initialText?: string;
  onSubmit: (text: string) => unknown;
}

export default function CommentForm({
  label,
  submitLabel,
  initialText,
  onSubmit,
}: CommentFormProps) {
  const submit = (formData: FormData) => {
    const text = formData.get("text");

    if (typeof text !== "string" || !text.trim()) return;

    onSubmit(text);
  };

  return (
    <Form action={submit}>
      <Input
        name="text"
        required
        placeholder={label}
        aria-label={label}
        defaultValue={initialText}
        autoFocus
      />

      <SubmitButton type="submit">{submitLabel}</SubmitButton>
    </Form>
  );
}
