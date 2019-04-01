import * as React from 'react';
import { H2, Text } from 'collector-portal-framework/dist/components';
import { ComplianceFormQuestion } from './FormQuestion';
import { populateComplianceQuestionWithAnswer } from './populate-answers';
import { complianceCategoryIsValid } from './validation';
import * as models from './models';

export { models as ComplianceModels };

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

export class ComplianceForm extends React.Component<Props> {
    private handleAnswer = (answer: models.Answer) => {
        const updatedCategory: models.Category = {
            ...this.props.category,
            questions: this.props.category.questions.map(question => populateComplianceQuestionWithAnswer(question, answer)),
        };

        this.props.onUpdate(updatedCategory, complianceCategoryIsValid(updatedCategory));
    };

    render() {
        const { category } = this.props;

        return (
            <>
                <H2>{category.title}</H2>
                {category.description && <Text>{category.description}</Text>}
                {category.questions.map((question: any) => (
                    <ComplianceFormQuestion
                        key={question.id}
                        translationStrings={this.props.translationStrings}
                        onAnswer={this.handleAnswer}
                        {...question}
                    />
                ))}
            </>
        );
    }
}
