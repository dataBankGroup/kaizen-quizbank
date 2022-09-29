import { useState } from "react";
import * as yup from "yup";
import { Box, dividerClasses, Modal } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { Question } from "../../utils/Type";
import PreviewIcon from "@mui/icons-material/Preview";
import Tooltip from "@mui/material/Tooltip";

interface ViewProps {
  question: Question;
  index: number;
}

const View: React.FC<ViewProps> = ({ question, index }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log(question);

  return (
    <>
      <Tooltip title="View Question">
        <button className="text-amber-400" onClick={handleOpen}>
          <PreviewIcon />
        </button>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
          className="w-full max-w-[674px] flex flex-col space-y-4 rounded-md overflow-y-scroll max-h-[600px] divide-y"
        >
          <div className="flex items-center justify-between text-2xl text-amber-400 font-bold">
            <h5>View Question</h5>
            <CancelPresentationIcon onClick={handleClose} />
          </div>

          <div className="pt-4">
            <p className="flex justify-end capitalize">
              {`${question.difficulty} (${question.score} pts)`}
            </p>
            <p className="text-lg font-semibold">{`${index + 1}.  ${
              question.question_text
            }`}</p>
            {question.image !== "" && (
              <div className="flex items-center justify-center">
                <img
                  src={question.image}
                  className="h-[250px] w-auto "
                  alt="Question"
                />
              </div>
            )}
            {question.answers.length > 1 ? (
              question.answers.map((answer, ind) => {
                return (
                  <div key={answer.id} className="block px-6 pt-1">
                    <p className={`${answer.is_correct && "text-green-500"}`}>
                      {String.fromCharCode(97 + ind)}. {answer.answer_text}
                    </p>
                  </div>
                );
              })
            ) : (
              <div key={question.answers[0].id} className="block px-6 pt-1">
                <p
                  className={`${
                    question.answers[0].is_correct && "text-green-500"
                  }`}
                >
                  {question.answers[0].answer_text}
                </p>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};
export default View;
