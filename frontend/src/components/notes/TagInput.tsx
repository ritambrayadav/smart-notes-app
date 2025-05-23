import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { TagsProps } from "@/utils/interface";

const TagInput = ({ tagInput, onInputChange, onAddTag }: TagsProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div>
      <label className="block mb-1 font-medium">Tags</label>
      <div className="flex space-x-2 mb-3">
        <Input
          placeholder="Enter a tag and press Enter"
          value={tagInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button type="button" onClick={onAddTag}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default TagInput;
