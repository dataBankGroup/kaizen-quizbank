import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { Question } from "../../utils/Type";

interface ShowProps {
  questions: Question[];
  label: string;
}

const Show: React.FC<ShowProps> = ({ questions, label }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button className="text-amber-400 font-semibold" onClick={handleOpen}>
        {label}
      </button>
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
          className="w-full max-w-[674px] flex flex-col space-y-4 rounded-md overflow-y-scroll max-h-[600px]"
        >
          <div className="flex items-center justify-between text-2xl text-amber-400 font-bold border-b-2 pb-4">
            <h5>All Questions</h5>
            <CancelPresentationIcon onClick={handleClose} />
          </div>

          <div className="flex flex-col">
            {questions.map((question, index) => {
              return (
                <div className="pt-3" key={question.id}>
                  <p className="block text-justify text-lg font-semibold">{`${
                    index + 1
                  }.  ${question.question_text}`}</p>
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
                          <p
                            className={`text-justify ${
                              answer.is_correct && "text-green-500"
                            }`}
                          >
                            {question.question_type !== "enumeration"
                              ? String.fromCharCode(97 + ind) + ". "
                              : "- "}
                            {answer.answer_text}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      key={question.answers[0].id}
                      className="block px-6 pt-1"
                    >
                      <p
                        className={`text-justify ${
                          question.answers[0].is_correct && "text-green-500"
                        }`}
                      >
                        {question.answers[0].answer_text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Show;
