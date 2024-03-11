import { describe, it, expect, vi } from "vitest";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { render, screen, userEvent } from "../utils/test-utils";
import Terminal, { commands } from "../components/Terminal";

// setup function
function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const allCmds = commands.map(cmdObj => cmdObj.cmd);

describe("Terminal Component", () => {
  let terminalInput: HTMLInputElement;
  let user: UserEvent;

  beforeEach(() => {
    const termSetup = setup(<Terminal />);
    user = termSetup.user;
    terminalInput = screen.getByTitle("terminal-input");
  });

  describe("Input Features & Initial State", () => {
   

    it("should change input value", async () => {
      await user.type(terminalInput, "demo");
      expect(terminalInput.value).toBe("demo");
    });

    it("should clear input value when click enter", async () => {
      await user.type(terminalInput, "demo{enter}");
      expect(terminalInput.value).toBe("");
    });
  });

  describe("Input Commands", () => {
    it("should return 'command not found' when input value is invalid", async () => {
      await user.type(terminalInput, "demo{enter}");
      expect(screen.getByTestId("not-found-0").innerHTML).toBe(
        "command not found: demo"
      );
    });


    it("should return '/home/satnaing' when user type 'pwd' cmd", async () => {
      await user.type(terminalInput, "pwd{enter}");
      expect(screen.getByTestId("latest-output").firstChild?.textContent).toBe(
        "/home/satnaing"
      );
    });

    it("should display cmd history when user type 'history' cmd", async () => {
      await user.type(terminalInput, "history{enter}");

      const commands =
        screen.getByTestId("latest-output").firstChild?.childNodes;

      expect(commands?.length).toBe(3);

      const typedCommands: string[] = [];
      commands?.forEach(cmd => {
        typedCommands.push(cmd.textContent || "");
      });

      expect(typedCommands).toEqual(["welcome", "history"]);
    });

    it("should clear everything when user type 'clear' cmd", async () => {
      await user.type(terminalInput, "clear{enter}");
      expect(screen.getByTestId("terminal-wrapper").children.length).toBe(1);
    });

    it("should return `hello world` when user type `echo hello world` cmd", async () => {
      await user.type(terminalInput, "echo hello world{enter}");
      expect(screen.getByTestId("latest-output").firstChild?.textContent).toBe(
        "hello world"
      );
    });

    it("should return `hello world` without quotes when user type `echo 'hello world'` cmd", async () => {
      // omit single quotes
      await user.type(terminalInput, "echo 'hello world'{enter}");
      expect(screen.getByTestId("latest-output").firstChild?.textContent).toBe(
        "hello world"
      );

      // omit double quotes
      await user.type(terminalInput, 'echo "hello world"{enter}');
      expect(screen.getByTestId("latest-output").firstChild?.textContent).toBe(
        "hello world"
      );

      // omit backtick
      await user.type(terminalInput, "echo `hello world`{enter}");
      expect(screen.getByTestId("latest-output").firstChild?.textContent).toBe(
        "hello world"
      );
    });

    it("should render Welcome component when user type 'welcome' cmd", async () => {
      await user.type(terminalInput, "clear{enter}");
      await user.type(terminalInput, "welcome{enter}");
      expect(screen.getByTestId("welcome")).toBeInTheDocument();
    });

    const otherCmds = [
      "help",
      "history",
      "themes",
    ];
    otherCmds.forEach(cmd => {
      it(`should render ${cmd} component when user type '${cmd}' cmd`, async () => {
        await user.type(terminalInput, `${cmd}{enter}`);
        expect(screen.getByTestId(`${cmd}`)).toBeInTheDocument();
      });
    });
  });

  describe("Redirect commands", () => {
    beforeEach(() => {
      window.open = vi.fn();
    });



  });

  describe("Invalid Arguments", () => {
    const specialUsageCmds = ["themes"];
    const usageCmds = allCmds.filter(
      cmd => !["echo", ...specialUsageCmds].includes(cmd)
    );

    usageCmds.forEach(cmd => {
      it(`should return usage component for ${cmd} cmd with invalid arg`, async () => {
        await user.type(terminalInput, `${cmd} sth{enter}`);
        expect(screen.getByTestId("usage-output").innerHTML).toBe(
          `Usage: ${cmd}`
        );
      });
    });

    specialUsageCmds.forEach(cmd => {
      it(`should return usage component for '${cmd}' cmd with invalid arg`, async () => {
        await user.type(terminalInput, `${cmd} sth{enter}`);
        expect(screen.getByTestId(`${cmd}-invalid-arg`)).toBeInTheDocument();
      });

      it(`should return usage component for '${cmd}' cmd with extra args`, async () => {
        const arg = cmd === "themes" ? "set light" : "go 1";
        await user.type(terminalInput, `${cmd} ${arg} extra-arg{enter}`);
        expect(screen.getByTestId(`${cmd}-invalid-arg`)).toBeInTheDocument();
      });

      it(`should return usage component for '${cmd}' cmd with incorrect option`, async () => {
        const arg = cmd === "themes" ? "go light" : "set 4";
        window.open = vi.fn();

        await user.type(terminalInput, `themes set espresso{enter}`);

        // then run cmd with incorrect options
        await user.type(terminalInput, `${cmd} ${arg}{enter}`);
        expect(window.open).toBeCalledTimes(2);

        // TODO: Test theme change
      });
    });
  });

  describe("Keyboard shortcuts", () => {
    allCmds.forEach(cmd => {
      it(`should autocomplete '${cmd}' when 'Tab' is pressed`, async () => {
        await user.type(terminalInput, cmd.slice(0, 2));
        await user.tab();
        expect(terminalInput.value).toBe(cmd);
      });
    });

    allCmds.forEach(cmd => {
      it(`should autocomplete '${cmd}' when 'Ctrl + i' is pressed`, async () => {
        await user.type(terminalInput, cmd.slice(0, 2));
        await user.keyboard("{Control>}i{/Control}");
        expect(terminalInput.value).toBe(cmd);
      });
    });

    it("should clear when 'Ctrl + l' is pressed", async () => {
      await user.type(terminalInput, "history{enter}");
      await user.keyboard("{Control>}l{/Control}");
      expect(screen.getByTestId("terminal-wrapper").children.length).toBe(1);
    });

  
  });
});
