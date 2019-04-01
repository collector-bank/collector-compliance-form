import * as React from 'react';
import { ComplianceFormQuestion } from './FormQuestion';
import { Answer, Question } from './models';
import { complianceAnswerIsValid } from './validation';
import { TranslationStrings } from '.';

type Item = any;

interface Props {
    item: Item;
    onUpdate: (item: Item, isValid: boolean) => void;
}

export const groupQuestionFormBuilder = (questions: Question[], onAnswer: any, disabled: any, translationStrings: TranslationStrings): any => {
    class GroupQuestionForm extends React.Component<Props> {
        private handleAnswer = (answer: Answer) => {
            const question = questions.find(x => x.id === answer.questionId);

            const item = {
                ...this.props.item,
                [answer.questionId]: {
                    ...question,
                    ...answer,
                }
            };

            this.props.onUpdate(item, this.isValid(item));
        }

        private isValid = (item: Item) => {
            const answers = Object.keys(item).map(y => item[y]); // "Object.values() polyfill"

            return questions.length === answers.length && answers.every(complianceAnswerIsValid);
        }

        render() {
            return (
                <>
                    {questions.map((question: any) => {
                        const answer: any = {};

                        if (this.props.item && question.id in this.props.item) {
                            const q = this.props.item[question.id];

                            answer.answer = q.answer;
                            answer.selectedOptions = q.selectedOptions;
                        }

                        return (
                            <ComplianceFormQuestion
                                key={question.id}
                                translationStrings={translationStrings}
                                onAnswer={this.handleAnswer}
                                disabled={disabled}
                                {...question}
                                {...answer}
                            />
                        );
                    })}
                </>
            );
        }
    }

    return GroupQuestionForm;
};
