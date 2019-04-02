import * as React from 'react';
import Collapse from 'react-css-collapse';
import styled from 'collector-portal-framework';
import { ClassNames } from '@emotion/core';
import { Button, ButtonGroup } from 'collector-portal-framework/dist/components';
import { TranslationStrings } from '.';

const Container = styled.div({
    marginBottom: 20,
});

const FormContainer = styled.div({
    marginBottom: 16,
});

const ItemsContainer = styled.div({
    marginBottom: 16,
});

const ItemLabel = styled.div({
    fontWeight: 500,
});

const ItemContainer = styled.div<{ isEditing: boolean }>(
    ({ isEditing, theme }) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        border: '1px solid',
        borderColor: theme.colors.lightGray,
        padding: 16,
        marginBottom: 16,
        opacity: isEditing ? 0.5 : 1,
        pointerEvents: isEditing ? 'none' : 'initial',
    })
);

type Item = any;

interface FormComponentProps {
    item: Item;
    onUpdate: (item: Item, isValid: boolean) => void;
}

interface Props {
    items?: Item[];
    labelFn: (item: Item, index: number) => string;
    onUpdate: (items: Item[]) => void;
    singularLabel?: string;
    formComponent: React.ComponentClass<FormComponentProps>;
    maxCount?: number;
    translationStrings: TranslationStrings;
}

interface State {
    itemToEdit?: Item;
    itemIsValid: boolean;
    currentlyEditingIndex?: number;
}

export class SetHandler extends React.Component<Props, State> {
    state: State = {
        itemIsValid: false,
    };

    private addItem = () => {
        this.setState({
            itemToEdit: {},
            currentlyEditingIndex: -1,
        });
    };

    private editItem = (item: Item, index: number) => {
        this.setState({
            itemToEdit: item,
            currentlyEditingIndex: index,
        });
    };

    private removeItem = (item: Item) => {
        if (this.props.items && window.confirm(this.props.translationStrings.genericConfirmationQuestion)) {
            const items = this.props.items.filter(x => x !== item);

            this.props.onUpdate(items);
        }
    };

    private cancelEdit = () => {
        const hasEditedStuff = Object.keys(this.state.itemToEdit).length > 0;

        if (!hasEditedStuff || window.confirm(this.props.translationStrings.genericConfirmationCancelQuestion)) {
            this.setState({
                itemToEdit: undefined,
                currentlyEditingIndex: undefined,
            });
        }
    };

    private saveEdit = () => {
        let items: Item[];

        if (this.props.items == null) {
            items = [this.state.itemToEdit];
        } else if (this.state.currentlyEditingIndex != null && this.state.currentlyEditingIndex !== -1) {
            items = [
                ...this.props.items.slice(0, this.state.currentlyEditingIndex),
                this.state.itemToEdit,
                ...this.props.items.slice(this.state.currentlyEditingIndex + 1),
            ];
        } else {
            items = [...this.props.items, this.state.itemToEdit];
        }

        this.props.onUpdate(items);

        this.setState({
            itemToEdit: undefined,
            itemIsValid: false,
            currentlyEditingIndex: undefined,
        });
    };

    private handleUpdate = (item: Item, isValid: boolean) => {
        this.setState({
            itemToEdit: item,
            itemIsValid: isValid,
        });
    };

    private canAddNew = () => {
        if (this.props.maxCount && this.props.items && this.props.items.length >= this.props.maxCount) {
            return false;
        }

        return !this.state.itemToEdit;
    };

    render() {
        return (
            <ClassNames>
                {({ css }) => (
                    <Container>
                        {this.props.items && this.renderItems()}

                        <Collapse isOpen={Boolean(this.state.itemToEdit)} className={css({ transition: 'height 150ms' })}>
                            {this.renderForm()}
                        </Collapse>

                        {this.canAddNew() && (
                            <Button onClick={this.addItem} size="small">
                                {this.props.translationStrings.add} {this.props.singularLabel}
                            </Button>
                        )}
                    </Container>
                )}
            </ClassNames>
        );
    }

    private renderForm = () => {
        const FormComponent = this.props.formComponent;

        return (
            <>
                <FormContainer>
                    <FormComponent key={this.state.currentlyEditingIndex} item={this.state.itemToEdit} onUpdate={this.handleUpdate} />
                </FormContainer>

                <ButtonGroup>
                    <Button onClick={this.cancelEdit} type="text" size="small">
                        {this.props.translationStrings.cancel}
                    </Button>
                    <Button onClick={this.saveEdit} size="small" disabled={!this.state.itemIsValid}>
                        {this.props.translationStrings.save} {this.props.singularLabel}
                    </Button>
                </ButtonGroup>
            </>
        );
    };

    private renderItems = () => {
        return (
            <ItemsContainer>
                {this.props.items!.map((item, i) => (
                    <ItemContainer key={i} isEditing={i === this.state.currentlyEditingIndex}>
                        <ItemLabel>{this.props.labelFn(item, i)}</ItemLabel>

                        <ButtonGroup>
                            <Button onClick={() => this.editItem(item, i)} type="secondary" size="small">
                                {this.props.translationStrings.edit}
                            </Button>
                            <Button onClick={() => this.removeItem(item)} type="secondary" size="small">
                                {this.props.translationStrings.remove}
                            </Button>
                        </ButtonGroup>
                    </ItemContainer>
                ))}
            </ItemsContainer>
        );
    };
}
