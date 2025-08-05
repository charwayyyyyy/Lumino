import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1.5 items-center px-3 py-1 rounded-full shadow-sm transition-all duration-200",
              score > 79
                  ? "bg-gradient-to-r from-green-100 to-green-50 border border-green-200"
                  : score > 59
                      ? "bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200"
                      : score > 39
                          ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200"
                          : "bg-gradient-to-r from-red-100 to-red-50 border border-red-200"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-4"
        />
        <p
            className={cn(
                "text-sm font-semibold",
                score > 79
                    ? "text-green-700"
                    : score > 59
                        ? "text-blue-700"
                        : score > 39
                            ? "text-yellow-700"
                            : "text-red-700"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row justify-between items-center py-3 px-1">
        <p className="text-2xl font-bold bg-clip-text text-transparent primary-gradient">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-6 items-center w-full p-2">
        <div className="bg-gradient-to-br from-gray-50 to-white w-full rounded-xl px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm border border-gray-100">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-3 items-center" key={index}>
                <div className={cn(
                  "flex items-center justify-center rounded-full size-8",
                  tip.type === "good" ? "bg-green-100" : "bg-yellow-100"
                )}>
                  <img
                      src={
                        tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
                      }
                      alt="score"
                      className="size-5"
                  />
                </div>
                <p className="text-lg text-gray-700 font-medium">{tip.tip}</p>
              </div>
          ))}
        </div>
        <div className="flex flex-col gap-5 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-3 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md",
                      tip.type === "good"
                          ? "bg-gradient-to-br from-green-50 to-green-50/50 border border-green-200 text-green-800"
                          : "bg-gradient-to-br from-yellow-50 to-yellow-50/50 border border-yellow-200 text-yellow-800"
                  )}
              >
                <div className="flex flex-row gap-3 items-center">
                  <div className={cn(
                    "flex items-center justify-center rounded-full size-8",
                    tip.type === "good" ? "bg-green-100" : "bg-yellow-100"
                  )}>
                    <img
                        src={
                          tip.type === "good"
                              ? "/icons/check.svg"
                              : "/icons/warning.svg"
                        }
                        alt="score"
                        className="size-5"
                    />
                  </div>
                  <p className="text-xl font-bold">{tip.tip}</p>
                </div>
                <p className="text-base leading-relaxed pl-11">{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-2xl font-bold mb-4 px-2">Detailed Feedback</h2>
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;
