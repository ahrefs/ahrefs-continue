import {
  CheckBadgeIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import { ToCoreFromIdeOrWebviewProtocol } from "core/protocol/core";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { lightGray } from "../../components";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";
import GitHubSignInButton from "../../components/modelSelection/quickSetup/GitHubSignInButton";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import {
  setDialogMessage,
  setShowDialog,
} from "../../redux/slices/uiStateSlice";
import { isJetBrains } from "../../util";
import { FREE_TRIAL_LIMIT_REQUESTS, hasPassedFTL } from "../../util/freeTrial";
import { Div, StyledButton } from "./components";
import { useOnboarding } from "./utils";

type OnboardingMode =
  ToCoreFromIdeOrWebviewProtocol["completeOnboarding"][0]["mode"];

function Onboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ideMessenger = useContext(IdeMessengerContext);

  const [hasSignedIntoGh, setHasSignedIntoGh] = useState(false);
  const [selectedOnboardingMode, setSelectedOnboardingMode] = useState<
    OnboardingMode | undefined
  >(undefined);

  const { completeOnboarding } = useOnboarding();

  function onSubmit() {
    ideMessenger.post("completeOnboarding", {
      mode: selectedOnboardingMode,
    });

    /**
     * "completeOnboarding" above will update the config with our
     * new embeddings provider. If it's not the default local provider,
     * we need to re-index the codebase.
     */
    if (selectedOnboardingMode !== "local") {
      ideMessenger.post("index/forceReIndex", undefined);
    }

    switch (selectedOnboardingMode) {
      case "local":
        navigate("/localOnboarding");
        break;

      case "apiKeys":
        navigate("/apiKeysOnboarding");
        break;

      case "freeTrial":
        completeOnboarding();
        break;
    
      case "default":
        completeOnboarding();
        break

      default:
        break;
    }
  }

  return (
    <div className="max-w-96  mx-auto leading-normal">
      <div className="leading-relaxed">
        <h1 className="text-center">Welcome to Ahrefs-Continue</h1>
        <p className="text-center ">
          There is nothing to set up. Click "Local models" and proceed.
        </p>
      </div>

      <div className="flex flex-col gap-6 pb-8 pt-4">
        <Div
          selected={selectedOnboardingMode === "default"}
          onClick={() => setSelectedOnboardingMode("default")}
        >
          <h3>
            <ComputerDesktopIcon
              width="1.4em"
              height="1.4em"
              className="align-middle pr-2"
            />
            Local models
          </h3>
          <p>
            Every model is completely self-hosted in Ahrefs!
          </p>
        </Div>
      </div>

      <div className="flex justify-end">
          <StyledButton disabled={!selectedOnboardingMode} onClick={onSubmit}>
            Continue
          </StyledButton>
        </div>
    </div>
  );
}

export default Onboarding;
