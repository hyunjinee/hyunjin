import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: grid;
  flex-direction: column;
  grid-template-columns: 1fr;
  grid-column-gap: 0;
  grid-row-gap: 2rem;
  grid-template-rows: 15% 65% 20% !important;

  height: auto !important;
  margin: 0 !important;
  padding: 2rem 3.2rem 5.6rem;
  border: 2px solid hsla(0, 0%, 100%, 0.06);
  border-radius: 2.2rem;
  box-shadow: 0 10px 34px 0 rgb(0 0 0 / 35%);
  background-color: #1d1a27;

  overflow: hidden;
`;
export const Category = styled.h5`
  color: #6648b6;
  font-size: 1.8rem;
  width: 100%;
`;
export const ContentContainer = styled.div``;
export const ContentName = styled.h2``;
export const Footer = styled.div`
  display: flex;
  justify-content: space-between;

  h6 {
    color: #8b8989;
  }
`;
