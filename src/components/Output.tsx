import Clear from "./commands/Clear";
import Echo from "./commands/Echo";
import GeneralOutput from "./commands/GeneralOutput";
import Help from "./commands/Help";
import Welcome from "./commands/Welcome";
import History from "./commands/History";
import Themes from "./commands/Themes";
import AddUser from "./commands/AddUser";
import Su from "./commands/Su";
import { OutputContainer, UsageDiv } from "./styles/Output.styled";
import { termContext } from "./Terminal";
import { useContext } from "react";

type Props = {
  index: number;
  cmd: string;
};

const Output: React.FC<Props> = ({ index, cmd }) => {
  const { arg } = useContext(termContext);

  const specialCmds = ["projects", "socials", "themes", "echo", "adduser", "su"];
  //暂时把su和adduser加入到specialCmds中
  // return 'Usage: <cmd>' if command arg is not valid
  // eg: about tt
  if (!specialCmds.includes(cmd) && arg.length > 0)
    return <UsageDiv data-testid="usage-output">Usage: {cmd}</UsageDiv>;

  return (
    <OutputContainer data-testid={index === 0 ? "latest-output" : null}>
      {
        {
          clear: <Clear />,
          echo: <Echo />,
          help: <Help />,
          history: <History />,
          pwd: <GeneralOutput>/home/satnaing</GeneralOutput>,
          themes: <Themes />,
          welcome: <Welcome />,
          whoami: <GeneralOutput>visitor</GeneralOutput>,
          adduser: <AddUser />,
          su: <Su />,
        }[cmd]
      }
    </OutputContainer>
  );
};

export default Output;
