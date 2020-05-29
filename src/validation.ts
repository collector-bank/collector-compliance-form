import {
    Category,
    CountryQuestion,
    FreeTextQuestion,
    GroupQuestion,
    Question,
    SelectQuestion,
    BeneficialOwnersQuestion
} from './models';

export const categoryIsValid = (complianceCategory: Category) => {
    return complianceCategory.questions.every(answerIsValid);
};

export const answerIsValid = (question: Question): boolean => {
    switch (question.questionType) {
        case 0:
            return selectAnswerIsValid(question);
        case 1:
            return freeTextAnswerIsValid(question);
        case 2:
            return countryAnswerIsValid(question);
        case 3:
            return groupIsValid(question);
        case 4:
            return beneficialOwnersIsValid(question);
    }
};

const selectAnswerIsValid = (question: SelectQuestion): boolean => {
    if (question.selectedOptions && question.selectedOptions.length > 0) {
        return question.selectedOptions.every(selectedOption => {
            if (selectedOption.followUpQuestions) {
                return selectedOption.followUpQuestions.every(answerIsValid);
            }

            return false;
        });
    }

    return false;
};

const countryAnswerIsValid = (question: CountryQuestion): boolean => {
    if (question.selectedOptions && question.selectedOptions.length > 0) {
        return question.selectedOptions.every(selectedOption => {
            if (selectedOption.validComplianceOption != null) {
                return selectedOption.validComplianceOption;
            } else {
                return false;
            }
        });
    }

    return false;
};

const freeTextAnswerIsValid = (question: FreeTextQuestion): boolean => {
    if (question.isMandatory === false) {
        return true;
    } else if (question.answer != null && question.answer !== '') {
        return true;
    } else {
        return false;
    }
};

const groupIsValid = (group: GroupQuestion): boolean => {
    if (group.answers && group.answers.length > 0) {
        return group.answers.every(questions => questions.every(answerIsValid));
    }

    return false;
};

const beneficialOwnersIsValid = (question : BeneficialOwnersQuestion) : boolean => {
    return true;
}
