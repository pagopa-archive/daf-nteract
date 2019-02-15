import {
  Button,
  EditableText,
  H1,
  ITagProps,
  Position,
  Tag,
  Tooltip
} from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";

// https://github.com/jupyter/nbformat/blob/master/nbformat/v4/nbformat.v4.schema.json#L67

const tagStyle: object = {
  background: "#f1f8ff",
  color: "#0366d6",
  marginRight: "5px"
};

const authorStyle: object = {
  background: "#E5E5E5",
  fontStyle: "italic",
  marginRight: "5px"
};

const authorStyleBlack: object = { ...authorStyle, color: "black" };

export interface AuthorObject {
  name: string;
}

export interface HeaderDataProps {
  authors: AuthorObject[];
  title: string;
  description: string;
  tags: string[];
}

export interface HeaderEditorProps {
  /**
   * The data that the header should be populated with.
   */
  headerData: HeaderDataProps;
  /**
   * Whether or not the fields of the header can be edited.
   */
  editable: boolean;
  /**
   * An event handler to run whenever header fields are modified.
   */
  onChange: (props?: HeaderDataProps) => void;
  /**
   *
   */
  onRemove: (e: React.MouseEvent<HTMLButtonElement>, props: ITagProps) => void;
  /**
   * The theme of the header.
   */
  theme: "light" | "dark";
}

export interface HeaderEditorState {
  editMode: "none" | "author" | "tag";
}

const addTagMessage: JSX.Element = <span>Add a tag</span>;
const addAuthorMessage: JSX.Element = <span>Add an author</span>;

class HeaderEditor extends React.PureComponent<
  HeaderEditorProps,
  HeaderEditorState
> {
  static defaultProps: HeaderEditorProps = {
    editable: true,
    headerData: {
      authors: [],
      description: "",
      tags: [],
      title: ""
    },
    // tslint:disable no-empty
    onChange: () => {},
    onRemove: (e: React.MouseEvent<HTMLButtonElement>, props: ITagProps) => {},
    theme: "light"
  };

  constructor(props: HeaderEditorProps) {
    super(props);

    this.state = {
      editMode: "none"
    };
  }

  render(): JSX.Element {
    // Otherwise assume they have their own editor component
    const { editable, headerData, onChange } = this.props;
    const marginStyles: object = { marginTop: "10px" };
    const styles: object = { background: "#EEE", padding: "10px" };
    const onTextChange = (newText: string): void => {
      this.props.onChange({
        ...headerData,
        title: newText
      });
    };
    const onEditorChange = (newText: string) => {
      onChange({
        ...headerData,
        description: newText
      });
    };
    const onAuthorsRemove = (t: any) => (
      evt: React.MouseEvent<HTMLButtonElement>,
      props: ITagProps
    ) => {
      if (editable === true) {
        onChange({
          ...headerData,
          authors: headerData.authors.filter(p => p.name !== t.name)
        });
        return;
      }
      return;
    };
    const onTagsRemove = (t: any) => (
      e: React.MouseEvent<HTMLButtonElement>,
      props: ITagProps
    ) => {
      if (editable) {
        onChange({
          ...headerData,
          tags: headerData.tags.filter(p => p !== t)
        });
        return;
      }
      return;
    };
    const onTagsConfirm = (e: any) => {
      onChange({
        ...headerData,
        tags: [...headerData.tags, e]
      });
      this.setState({ editMode: "none" });
    };
    const onAuthorsConfirm = (e: any) => {
      onChange({
        ...headerData,
        authors: [...headerData.authors, { name: e }]
      });
      this.setState({ editMode: "none" });
    };
    const onCancel = () => this.setState({ editMode: "none" });
    const onClick = () => this.setState({ editMode: "author" });
    const onAdd = () => this.setState({ editMode: "tag" });

    return (
      <header>
        <div style={styles}>
          <H1>
            <EditableText
              value={headerData.title}
              placeholder="Edit title..."
              disabled={!editable}
              onChange={onTextChange}
            />
          </H1>
          <div>
            {headerData.authors.length <= 0 ? null : "By "}
            {headerData.authors.map(t => (
              <Tag
                key={t.name}
                large
                minimal
                style={authorStyle}
                onRemove={onAuthorsRemove(t)}
              >
                {t.name}
              </Tag>
            ))}
            {(this.state.editMode === "author" && (
              <Tag style={authorStyleBlack}>
                <EditableText
                  maxLength={40}
                  className="author-entry"
                  placeholder="Enter Author Name..."
                  selectAllOnFocus
                  onConfirm={onAuthorsConfirm}
                  onCancel={onCancel}
                />
              </Tag>
            )) || (
              <Tooltip
                content={addAuthorMessage}
                position={Position.RIGHT}
                usePortal={false}
                disabled={!editable}
              >
                <Button
                  icon="add"
                  className="author-button"
                  onClick={onClick}
                  minimal
                  disabled={!editable}
                />
              </Tooltip>
            )}
          </div>

          <div>
            {headerData.tags.map(t => (
              <Tag key={t} style={tagStyle} onRemove={onTagsRemove}>
                {t}
              </Tag>
            ))}
            {(this.state.editMode === "tag" && (
              <Tag style={tagStyle}>
                <EditableText
                  maxLength={20}
                  placeholder="Enter Tag Name..."
                  selectAllOnFocus
                  onConfirm={onTagsConfirm}
                  onCancel={onCancel}
                />
              </Tag>
            )) || (
              <Tooltip
                content={addTagMessage}
                position={Position.RIGHT}
                usePortal={false}
                disabled={!editable}
              >
                {
                  <Button
                    icon="add"
                    minimal
                    onClick={onAdd}
                    disabled={!editable}
                  />
                }
              </Tooltip>
            )}
          </div>
          <div style={marginStyles}>
            <EditableText
              maxLength={280}
              maxLines={12}
              minLines={3}
              multiline
              placeholder="Edit description..."
              selectAllOnFocus={false}
              value={headerData.description}
              disabled={!editable}
              onChange={onEditorChange}
            />
          </div>
        </div>
      </header>
    );
  }
}

// We export this for testing purposes.
export { HeaderEditor };

export default HeaderEditor;
