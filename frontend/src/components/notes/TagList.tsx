import { TagListProps } from "@/utils/interface";
const TagList = ({ tags, onRemoveTag }: TagListProps) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {tags.map((tag) => (
      <span
        key={tag}
        className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
      >
        {tag}
        <button
          type="button"
          onClick={() => onRemoveTag(tag)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </span>
    ))}
  </div>
);

export default TagList;
