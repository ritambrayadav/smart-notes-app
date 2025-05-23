import React from "react";
import Button from "@/components/common/Button";
import LinkText from "../common/LinkText";

const NotesTopBar = () => (
  <div className="flex items-center justify-between mb-6">
    <LinkText href="/notes/new">
      <Button>+ Create Note</Button>
    </LinkText>
  </div>
);

export default NotesTopBar;
