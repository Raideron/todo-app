import React from 'react';

interface TextWithLinksProps {
  text: string;
}

export const TextWithLinks: React.FC<TextWithLinksProps> = (props) => {
  const parts = props.text.split(/(\s)/g);
  // eslint-disable-next-line react/no-array-index-key
  const textAndLinks: React.ReactNode[] = parts.map((part, i) => <AFromUrl key={part + i} inputText={part} />);

  return <>{textAndLinks}</>;
};

interface AFromUrlProps {
  inputText: string;
}

const AFromUrl: React.FC<AFromUrlProps> = (props) => {
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  const isUrl = urlRegex.test(props.inputText);
  const canParseUrl = URL.canParse(props.inputText);

  if (!isUrl || !canParseUrl) {
    return <>{props.inputText}</>;
  }

  const url = new URL(props.inputText);

  return (
    <a href={url.href} target='_blank' rel='noreferrer'>
      {props.inputText}
    </a>
  );
};
