import { createApi } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import axiosInstance from 'axios';

export const deleteBlog = async (blogId: string) => {
  // todo: delete blog from database
  // todo: delete blog from cloudinary
  console.log("Deleting blog with ID:", blogId);
};

export const getBlog = async (blogId: string) => {
  // todo: get blog from database
  return {
    _id: blogId,
    title: "Unleash Your Inner Artist: A Journey Through Creativity",
    content: "<p>This blog is more than just pretty pictures (though we'll have plenty of those!). We're passionate about fostering a community where artists and art enthusiasts can connect, learn, and be inspired. Here's a glimpse of what you can look forward to:</p><ul><li><p><strong>Artist Spotlights:</strong> We'll delve into the stories and techniques of both emerging and established artists, giving you a behind-the-scenes look at their creative processes and inspirations.</p></li><li><p><strong>Technique Tuesdays:</strong> Get your hands dirty with our weekly tutorials covering various art techniques, from mastering watercolor washes to sculpting with clay. We'll break down complex processes into easy-to-follow steps, perfect for beginners and experienced artists alike.</p></li><li><p><strong>Art History Highlights:</strong> Journey through time as we explore significant art movements, influential artists, and the historical context that shaped their work. Understanding the past can help us appreciate the present and inspire the future.</p></li><li><p><strong>Creative Challenges &amp; Prompts:</strong> Feeling uninspired? We'll provide regular creative prompts and challenges to spark your imagination and get your creative juices flowing. Share your creations with us and the community!</p></li><li><p><strong>Exhibition &amp; Event Reviews:</strong> Stay up-to-date on the latest art exhibitions, gallery openings, and art events happening near you (and sometimes, around the world!). We'll share our insights and reviews to help you discover new artists and experience art in person.</p></li><li><p><strong>Art Supply Reviews &amp; Recommendations:</strong> Navigating the world of art supplies can be overwhelming. We'll test and review different products, from paints and brushes to papers and digital tools, to help you make informed choices and find the perfect materials for your artistic journey.</p></li><li><p><strong>Discussions &amp; Community:</strong> We encourage you to join the conversation! Share your thoughts, ask questions, and connect with other artists and art lovers in the comments section. Let's build a supportive and inspiring community together.</p></li></ul><p><strong>More Than Just a Hobby:</strong></p><p>We believe that art is more than just a hobby; it's a powerful form of communication, a way to explore the world around us, and a path to self-discovery. Whether you create art yourself or simply appreciate the art of others, we hope this blog will inspire you to embrace your creativity and connect with the transformative power of art.</p><p><strong>Stay Connected:</strong></p><p>Don't forget to subscribe to our newsletter and follow us on social media [links to your social media pages] to stay up-to-date on the latest blog posts, events, and creative challenges.</p><p><strong>We're excited to embark on this artistic journey with you! What are you most passionate about in the art world? Share your thoughts in the comments below!</strong></p>",
    image:"https://res.cloudinary.com/dbh0wjh24/image/upload/v1738799600/blog/file_usq6dl.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      _id: "1",
      name: "John Doe",
      image: "https://res.cloudinary.com/dbh0wjh24/image/upload/v1738799600/blog/file_usq6dl.jpg",
    },
    views: 100,
    tags: ["art", "creative", "artists"],
    heartCount: 100,
    published: true,
    status: "pending" as const,
  };
};
export const getBlogs = async () => {
  try {
      const res = await createApi().get("/blog");
      return res.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};


export async function updateBlog({
	accessToken,
	updateData
}: {
	accessToken: string;
	updateData: {
		_id: string;
		title?: string;
		content?: string;
		image?: string;
		published?: boolean;
		status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    tags?: string[];
	};
}) {
	const payload: {
		title?: string;
		content?: string;
		image?: string;
		published?: boolean;
		tags?: string[];
	} = {};

	if (updateData.title) payload.title = updateData.title;
	if (updateData.content) payload.content = updateData.content;
	if (updateData.image) payload.image = updateData.image;
	if (updateData.published !== undefined)
		payload.published = updateData.published;
	if (updateData.tags) payload.tags = updateData.tags;
	try {
		const res: ApiResponse = await createApi(accessToken).put(
			`/blog/${updateData._id}`,
			payload,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(err);
			console.error(
				`Error when update blog: ${err.response?.data.errorCode}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}



export async function approveBlog({
	accessToken,
	blogId,
}: {
	accessToken: string;
	blogId: string;
}) {
	try {
		const res: ApiResponse = await createApi(accessToken).put(`/blog/${blogId}/approve`);
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(err);
			console.error(
				`Error when approve blog: ${err.response?.data.errorCode}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}


export async function rejectBlog({
	accessToken,
	blogId,
	reason
}: {
	accessToken: string;
	blogId: string;
	reason: string;
}) {
	try {
		
		const res: ApiResponse = await createApi(accessToken).put(`/blog/${blogId}/reject`, { reason });
		return res.data;
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(error);
			console.error(
				`Error when rejecting blog: ${error.response?.data.errorCode}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
	}
}