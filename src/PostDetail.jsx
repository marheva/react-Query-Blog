import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, { method: "DELETE" });
  return response.json();
}

async function updatePost(postId, updatedMessage) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, {
    method: "PATCH",
    data: { title: updatedMessage ? updatedMessage : "REACT QUERY FOREVER!!!!" },
  });
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isError, error, isLoading } = useQuery(["comment", post.id], () => {
    return fetchComments(post.id);
  });
  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));
  //OR
  // const deleteMutation = useMutation(() => deletePost(post.id));
  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>Error, {error.toString()}</h3>;

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete.</button>
      <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
      {deleteMutation.isError && <p style={{ color: "red" }}>Error.</p>}
      {deleteMutation.isLoading && <p style={{ color: "purple" }}>Deleting the post.</p>}
      {deleteMutation.isSuccess && <p style={{ color: "green" }}>Post has (not) been deleted.</p>}
      //
      {updateMutation.isError && <p style={{ color: "red" }}>Error.</p>}
      {updateMutation.isLoading && <p style={{ color: "purple" }}>Updating the post.</p>}
      {updateMutation.isSuccess && <p style={{ color: "green" }}>Post has (not) been updated.</p>}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
