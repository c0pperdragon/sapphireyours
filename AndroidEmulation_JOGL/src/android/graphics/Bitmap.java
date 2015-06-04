package android.graphics;

import java.awt.image.BufferedImage;
import java.nio.Buffer;
import java.nio.ByteBuffer;

public class Bitmap 
{
	public enum Config 	{
		ARGB_8888, ALPHA_8 
	}

	private final BufferedImage image;
	private final Config config;
	
	public Bitmap(BufferedImage image, Config config)
	{
		this.image = image;
		this.config = config;
	}
	
	public void copyPixelsToBuffer(Buffer dst)
	{
		int w = image.getWidth();
		int h = image.getHeight();
		int l = w*h;
		int[] b = new int[l];
		image.getRGB(0,0,w,h, b, 0,w);

		if (dst instanceof ByteBuffer)
		{	ByteBuffer bb = (ByteBuffer) dst;
			if (config==Config.ARGB_8888)
			{	for (int i=0; i<l; i++)
				{	int v = b[i];
					bb.put( (byte) ((v>>16)&0xff) );
					bb.put( (byte) ((v>>8)&0xff) );
					bb.put( (byte) ((v>>0)&0xff) );
					bb.put( (byte) ((v>>24)&0xff) );
				}
			}
			else if (config==Config.ALPHA_8)
			{	for (int i=0; i<l; i++)
				{	int v = b[i];
					bb.put( (byte) ((v>>24)&0xff) );
				}
			}
		}
		else
		{	throw new IllegalArgumentException("Can store pixel data only to ByteBuffer");
		}
	}
	
	public void getPixels (int[] pixels, int offset, int stride, int x, int y, int width, int height)
	{
		image.getRGB(x,y,width,height,pixels,offset,stride); 
	}
	
	public void setPixels(int[] pixels, int offset, int stride, int x, int y, int width, int height)
	{	
		image.setRGB(x,y,width,height,pixels,offset,stride);
	}

	public void setPixel(int x, int y, int color)
	{	
		image.setRGB(x,y,color);
	}
	
	public final Config getConfig()
	{	
		return config;
	}
	
	public final int getWidth()
	{
		return image.getWidth();
	}
	public final int getHeight()
	{
		return image.getHeight();
	}
	
	public Bitmap extractAlpha ()
	{
		return new Bitmap(image, Config.ALPHA_8);	
	}
	
	public static Bitmap createBitmap(int width, int height, Config config)
	{
		return new Bitmap(new BufferedImage(width,height, BufferedImage.TYPE_INT_ARGB), config);	
	}

}
