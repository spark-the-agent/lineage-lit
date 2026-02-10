#!/usr/bin/env python3
"""
Generate Hemingway Creative DNA Card using PIL
Creates a beautiful visual card without needing ComfyUI
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import os

def create_hemingway_card():
    """Create a beautiful Hemingway DNA card"""
    
    # Card dimensions (2.5 x 3.5 inches at 300 DPI = trading card size)
    width, height = 750, 1050
    
    # Create image with gradient background
    img = Image.new('RGB', (width, height), color='#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Create gradient effect (simulated with rectangles)
    for i in range(height):
        r = int(26 + (15 - 26) * i / height)
        g = int(26 + (33 - 26) * i / height)
        b = int(46 + (96 - 46) * i / height)
        draw.rectangle([(0, i), (width, i+1)], fill=(r, g, b))
    
    # Try to load fonts, fall back to defaults
    try:
        # Try different font options
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 48)
        font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 24)
        font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        font_title = ImageFont.load_default()
        font_subtitle = font_title
        font_body = font_title
        font_small = font_title
    
    # Gold accent color
    gold = '#ffd700'
    white = '#ffffff'
    light_gray = '#cccccc'
    
    # Draw decorative border
    border_margin = 30
    draw.rectangle(
        [(border_margin, border_margin), (width - border_margin, height - border_margin)],
        outline=gold, width=3
    )
    
    inner_margin = 40
    draw.rectangle(
        [(border_margin + inner_margin, border_margin + inner_margin), 
         (width - border_margin - inner_margin, height - border_margin - inner_margin)],
        outline='#d4af37', width=1
    )
    
    # Header section with icon
    y_pos = 80
    
    # Draw fishing icon (simplified)
    draw.text((width//2, y_pos), "🎣", fill=gold, font=font_title, anchor="mm")
    y_pos += 70
    
    # Name
    draw.text((width//2, y_pos), "Ernest Hemingway", fill=white, font=font_title, anchor="mm")
    y_pos += 60
    
    # Years
    draw.text((width//2, y_pos), "1899 — 1961", fill=light_gray, font=font_subtitle, anchor="mm")
    y_pos += 40
    
    # Nobel badge
    badge_text = "🏆 Nobel Prize 1954"
    bbox = draw.textbbox((0, 0), badge_text, font=font_small)
    badge_width = bbox[2] - bbox[0] + 30
    badge_height = bbox[3] - bbox[1] + 15
    badge_x = (width - badge_width) // 2
    draw.rounded_rectangle(
        [(badge_x, y_pos), (badge_x + badge_width, y_pos + badge_height)],
        radius=20, fill='#d4af3720', outline=gold, width=2
    )
    draw.text((width//2, y_pos + badge_height//2), badge_text, fill=gold, font=font_small, anchor="mm")
    y_pos += 80
    
    # Section: Signature Works
    draw.text((60, y_pos), "SIGNATURE WORKS", fill=gold, font=font_small)
    y_pos += 35
    
    works = [
        ("The Sun Also Rises", "1926 — Lost Generation"),
        ("A Farewell to Arms", "1929 — War & Love"),
        ("The Old Man and the Sea", "1952 — Pulitzer Prize")
    ]
    
    for title, subtitle in works:
        # Work card background
        draw.rounded_rectangle(
            [(50, y_pos), (width - 50, y_pos + 55)],
            radius=8, fill='#ffffff08', outline='#ffffff20', width=1
        )
        # Gold accent line
        draw.rectangle([(50, y_pos + 10), (53, y_pos + 45)], fill=gold)
        # Text
        draw.text((70, y_pos + 15), title, fill=white, font=font_body)
        draw.text((70, y_pos + 35), subtitle, fill=light_gray, font=font_small)
        y_pos += 65
    
    y_pos += 20
    
    # Section: Influenced By
    draw.text((60, y_pos), "INFLUENCED BY", fill=gold, font=font_small)
    y_pos += 35
    
    influences = ["Sherwood Anderson", "Mark Twain", "Ezra Pound"]
    x_start = 50
    for influence in influences:
        bbox = draw.textbbox((0, 0), influence, font=font_small)
        tag_width = bbox[2] - bbox[0] + 20
        tag_height = 32
        draw.rounded_rectangle(
            [(x_start, y_pos), (x_start + tag_width, y_pos + tag_height)],
            radius=16, fill='#ffffff10', outline='#ffffff30', width=1
        )
        draw.text((x_start + 10, y_pos + 8), influence, fill=light_gray, font=font_small)
        x_start += tag_width + 10
    
    y_pos += 50
    
    # Section: Influenced
    draw.text((60, y_pos), "INFLUENCED", fill=gold, font=font_small)
    y_pos += 35
    
    influenced = ["Raymond Carver", "Cormac McCarthy", "Joan Didion"]
    x_start = 50
    for person in influenced:
        bbox = draw.textbbox((0, 0), person, font=font_small)
        tag_width = bbox[2] - bbox[0] + 20
        tag_height = 32
        draw.rounded_rectangle(
            [(x_start, y_pos), (x_start + tag_width, y_pos + tag_height)],
            radius=16, fill='#ffffff10', outline='#ffffff30', width=1
        )
        draw.text((x_start + 10, y_pos + 8), person, fill=light_gray, font=font_small)
        x_start += tag_width + 10
    
    y_pos += 60
    
    # Quote section
    draw.rounded_rectangle(
        [(50, y_pos), (width - 50, y_pos + 90)],
        radius=12, fill='#ffd70008', outline='#ffd70030', width=1
    )
    draw.rectangle([(50, y_pos + 20), (53, y_pos + 70)], fill='#d4af37')
    
    quote = '"There is nothing to writing.\nAll you do is sit down at a\ntypewriter and bleed."'
    draw.text((70, y_pos + 20), quote, fill='#eeeeee', font=font_small)
    
    y_pos += 110
    
    # Footer
    draw.text((60, height - 60), "⚡ Lineage Lit", fill='#ffffff60', font=font_small)
    draw.text((width - 60, height - 60), "Explore lineage →", fill='#ffd700', font=font_small, anchor="rm")
    
    # Save
    output_path = Path("/home/spark/.openclaw/workspace/lineage-lit/public/hemingway-card-visual.png")
    img.save(output_path, quality=95)
    
    print(f"✅ Hemingway Creative DNA Card generated!")
    print(f"   Saved to: {output_path}")
    print(f"   Dimensions: {width}x{height}px")
    
    return output_path


if __name__ == "__main__":
    create_hemingway_card()
