import { User, WebsiteName, Wrapper } from "./styles/TerminalInfo.styled";
const TermInfo = () => {
  
const name = "";
  return (
    <Wrapper>
      <User>{name ? name : "visitor"}</User>@<WebsiteName>terminal.satnaing.dev</WebsiteName>:~$
    </Wrapper>
  );
};

export default TermInfo;
