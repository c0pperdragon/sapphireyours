package android.graphics;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

public class BitmapFactory 
{
	public static Bitmap decodeStream (InputStream is)
	{
		try {
		    BufferedImage img = ImageIO.read(is);
		    return new Bitmap(img, Bitmap.Config.ARGB_8888);		    
		} catch (IOException e) {
		}		
		return null;
	}
}
