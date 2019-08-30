import * as React from 'react';
import { H2, Text } from 'collector-portal-framework/dist/components';
import { ComplianceFormQuestion } from './FormQuestion';
import { populateQuestionWithAnswer } from './populate-answers';
import { categoryIsValid } from './validation';
import * as models from './models';
import { useEffect, useState } from 'react';

export { models as ComplianceModels };
export { SetHandler } from './SetHandler';

export interface TranslationStrings {
    genericError: string;
    genericConfirmationQuestion: string;
    genericConfirmationCancelQuestion: string;
    add: string;
    cancel: string;
    save: string;
    edit: string;
    remove: string;
}

interface Props {
    category: models.Category;
    onUpdate: (category: models.Category, isValid: boolean) => void;
    translationStrings: TranslationStrings;
}

export const ComplianceForm: React.FC<Props> = ({ category, onUpdate, translationStrings }) => {
    const [updatedCategory, setUpdatedCategory] = useState<models.Category>(category);

    const handleAnswer = (answer: models.Answer) => {
        setUpdatedCategory({
            ...category,
            questions: category.questions.map(question => populateQuestionWithAnswer(question, answer)),
        });
    };

    useEffect(() => {
        onUpdate(updatedCategory, categoryIsValid(updatedCategory));
    }, [onUpdate, updatedCategory]);

    return (
        <>
            <H2>{category.title}</H2>
            {category.description && <Text>{category.description}</Text>}
            {category.questions.map((question: any) => (
                <ComplianceFormQuestion key={question.id} translationStrings={translationStrings} onAnswer={handleAnswer} {...question} />
            ))}
        </>
    );
};
