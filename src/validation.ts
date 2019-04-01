import {
    SelectedOption,
    Category,
    Question,
    SelectQuestion,
    CountryQuestion,
    GroupQuestion,
    FreeTextQuestion,
    QuestionType
} from './models';

export const complianceCategoryIsValid = (complianceCategory: Category) => {
    return complianceCategory.questions.every(complianceAnswerIsValid);
};

export const complianceAnswerIsValid = (question: Question): boolean => {
    if (question.isMandatory === false) {
        return true;
    }

    switch (question.questionType) {
        case QuestionType.Select:
        case QuestionType.Country:
            return selectAnswerIsValid(question);
        case QuestionType.FreeText:
            return freeTextAnswerIsValid(question);
        case QuestionType.Group:
            return groupIsValid(question);
    }
};

const selectAnswerIsValid = (question: SelectQuestion & CountryQuestion): boolean => {
    if (question.selectedOptions && question.selectedOptions.length > 0) {
        return question.selectedOptions.every((selectedOption: SelectedOption) => {
            if (selectedOption.validComplianceOption != null) {
                return selectedOption.validComplianceOption;
            }

            if (selectedOption.followUpQuestions) {
                return selectedOption.followUpQuestions.every(complianceAnswerIsValid);
            }

            return false;
        });
    }

    return false;
};

const freeTextAnswerIsValid = (question: FreeTextQuestion): boolean => {
    if (question.answer != null && question.answer !== '') {
        return true;
    } else {
        return false;
    }
};

const groupIsValid = (group: GroupQuestion): boolean => {
    if (group.answers && group.answers.length > 0) {
        return group.answers.every(questions => questions.every(complianceAnswerIsValid));
    }

    return false;
};