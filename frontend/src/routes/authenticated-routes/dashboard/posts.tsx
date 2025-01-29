import { Box, Paper, Typography } from "@mui/material";
import type IPost from "@services/posts/interfaces/IPost";
import type { IPostsResponse } from "@services/posts/interfaces/IPostsResponses";

export const Posts = ({ data }: { data: IPostsResponse<IPost> }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginY: 6 }}>
      {data.posts.map((post) => (
        <Paper
          elevation={0}
          component="div"
          key={post.id}
          sx={{ marginTop: 4 }}
        >
          <Typography variant="h5">{post.title}</Typography>
          <Typography variant="body2">{post.body}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default Posts;
