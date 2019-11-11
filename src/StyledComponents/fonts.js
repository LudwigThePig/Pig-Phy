import styled from 'styled-components';

export const fontSizes = {
  heading1: '3.4em',
  heading2: '2.8em',
  heading3: '2.0em',
  paragraph: '1.6em',
  footnote: '1.5em',
};

export const Heading1 = styled.h1`
  font-size: ${fontSizes.heading1};
  line-height: -1.5em;
  font-weight: 300;
  margin: 0;
  color: ${({ color }) => color || 'inherit'};
`;
export const Heading2 = styled.h2`
  font-size: ${fontSizes.heading2};
  line-height: -0.5em;
  font-weight: 300;
  margin: 0;
  color: ${({ color }) => color || 'inherit'};
`;
export const Heading3 = styled.h3`
  font-size: ${fontSizes.heading3};
  line-height: 0;
  font-weight: 400;
  color: ${({ color }) => color || 'inherit'};
`;
export const Paragraph = styled.p`
  font-size: ${fontSizes.paragraph};
  line-height: 1.5em;
  font-weight: 400;
  text-decoration: none;
  margin: 0;
  color: ${({ color }) => color || 'inherit'};
`;
export const Footnote = styled.p`
  font-size: ${fontSizes.footnote};
  line-height: 1.4em;
  font-weight: 900;
  margin: 0;
  color: ${({ color }) => color || 'inherit'};
`;
export const FootnoteLight = styled.p`
  font-size: ${fontSizes.footnote};
  line-height: 0.4em;
  font-weight: 300;
  color: ${({ color }) => color || 'inherit'};
  margin: 0;
`;
export const Bold = styled.span`
  font-weight: 900;
`;

export const Anchor = styled.a`
  color: ${({ color }) => color || 'inherit'};
  font-weight: inherit;
  text-decoration: none;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.darkBrown};
  }
`;
