import { Answer, SelectedOption, Question, QuestionType } from './models';

export const populateComplianceQuestionWithAnswer = (question: Question, answer: Answer) => {
    switch (question.questionType) {
        case QuestionType.Select:
        case QuestionType.Country:
            return populateSelectQuestionWithAnswer(question, answer);
        case QuestionType.FreeText:
            return populateFreeTextQuestionWithAnswer(question, answer);
        case QuestionType.Group:
            return populateGroupQuestionWithAnswer(question, answer);
    }
};

const populateSelectQuestionWithAnswer = (question: Question, answer: Answer): any => {
    const populatedQuestion: Question = { ...question };

    if (question.id === answer.questionId && answer.selectedOptions != null) {
        populatedQuestion.selectedOptions = answer.selectedOptions;
    }

    if (populatedQuestion.options) {
        populatedQuestion.options = populatedQuestion.options.map((option: SelectedOption) => ({
            ...option,
            followUpQuestions: option.followUpQuestions
                ? option.followUpQuestions.map(quest => populateComplianceQuestionWithAnswer(quest, answer))
                : [],
        }));
    }

    if (populatedQuestion.selectedOptions) {
        populatedQuestion.selectedOptions = populatedQuestion.selectedOptions.map((option: SelectedOption) => ({
            ...option,
            followUpQuestions: option.followUpQuestions
                ? option.followUpQuestions.map(quest => populateComplianceQuestionWithAnswer(quest, answer))
                : [],
        }));
    }

    return populatedQuestion;
};

const populateFreeTextQuestionWithAnswer = (question: Question, answer: Answer) => {
    return question.id === answer.questionId
        ? { ...question, ...answer }
        : question;
};

const populateGroupQuestionWithAnswer = (question: Question, answer: Answer) => {
    const populatedQuestion: Question = { ...question };

    if (question.id === answer.questionId && answer.answers != null) {
        populatedQuestion.answers = answer.answers;
    }

    if (populatedQuestion.questions) {
        populatedQuestion.questions = populatedQuestion.questions.map(quest => populateComplianceQuestionWithAnswer(quest, answer));
    }

    return populatedQuestion;
};
