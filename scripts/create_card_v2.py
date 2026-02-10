#!/usr/bin/env python3
"""
Generate sleek, high-contrast Hemingway Creative DNA Card v2
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import os

def create_sleek_hemingway_card():
    """Create a modern, sleek Hemingway DNA card with high contrast"""
    
    # Card dimensions (2.5 x 3.5 inches at 300 DPI)
    width, height = 750, 1050
    
    # Create image with dark background
    img = Image.new('RGB', (width, height), color='#0a0a0f')
    draw = ImageDraw.Draw(img)
    
    # Create subtle radial gradient from center
    center_x, center_y = width // 2, height // 3
    for r in range(max(width, height), 0, -2):
        alpha = int(20 * (1 - r / max(width, height)))
        color_val = 20 + alpha
        draw.ellipse(
            [(center_x - r, center_y - r), (center_x + r, center_y + r)],
            fill=(color_val, color_val, color_val + 10)
        )
    
    # Try to load fonts
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 52)
        font_name = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 44)
        font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
        font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except:
        font_title = ImageFont.load_default()
        font_name = font_title
        font_subtitle = font_title
        font_body = font_title
        font_small = font_title
    
    # Colors - high contrast
    gold = '#FFD700'
    white = '#FFFFFF'
    off_white = '#E8E8E8'
    light_gray = '#B0B0B0'
    dark_card = '#151520'
    accent = '#FFA500'
    
    # Draw elegant thin border
    border_margin = 25
    draw.rectangle(
        [(border_margin, border_margin), (width - border_margin, height - border_margin)],
        outline=gold, width=2
    )
    
    # Inner subtle border
    draw.rectangle(
        [(border_margin + 8, border_margin + 8), 
         (width - border_margin - 8, height - border_margin - 8)],
        outline='#2a2a3a', width=1
    )
    
    y_pos = 70
    
    # Top accent line
    draw.rectangle([(60, y_pos), (width - 60, y_pos + 3)], fill=gold)
    y_pos += 30
    
    # Icon - fishing emoji with background circle
    circle_x, circle_y = width // 2, y_pos + 35
    draw.ellipse([(circle_x - 50, circle_y - 50), (circle_x + 50, circle_y + 50)], 
                 fill='#1e1e2e', outline=gold, width=2)
    draw.text((circle_x, circle_y), "🎣", fill=gold, font=font_title, anchor="mm")
    y_pos += 100
    
    # Name - large and prominent
    draw.text((width//2, y_pos), "ERNEST", fill=gold, font=font_title, anchor="mm")
    y_pos += 55
    draw.text((width//2, y_pos), "HEMINGWAY", fill=white, font=font_name, anchor="mm")
    y_pos += 50
    
    # Years with decorative lines
    line_width = 80
    draw.rectangle([(60, y_pos + 10), (60 + line_width, y_pos + 12)], fill=gold)
    draw.rectangle([(width - 60 - line_width, y_pos + 10), (width - 60, y_pos + 12)], fill=gold)
    draw.text((width//2, y_pos), "1899 — 1961", fill=light_gray, font=font_small, anchor="mm")
    y_pos += 45
    
    # Nobel badge - clean pill shape
    badge_text = "NOBEL PRIZE IN LITERATURE 1954"
    bbox = draw.textbbox((0, 0), badge_text, font=font_small)
    badge_width = bbox[2] - bbox[0] + 40
    badge_height = 36
    badge_x = (width - badge_width) // 2
    draw.rounded_rectangle(
        [(badge_x, y_pos), (badge_x + badge_width, y_pos + badge_height)],
        radius=18, fill=gold, outline=None
    )
    draw.text((width//2, y_pos + badge_height//2), badge_text, fill='#0a0a0f', 
              font=font_small, anchor="mm")
    y_pos += 70
    
    # Section divider
    draw.rectangle([(80, y_pos), (width - 80, y_pos + 1)], fill='#2a2a3a')
    y_pos += 25
    
    # SIGNATURE WORKS
    draw.text((60, y_pos), "SIGNATURE WORKS", fill=gold, font=font_subtitle)
    y_pos += 35
    
    works = [
        ("The Sun Also Rises", "1926"),
        ("A Farewell to Arms", "1929"),
        ("The Old Man and the Sea", "1952")
    ]
    
    for title, year in works:
        # Card background
        card_margin = 50
        draw.rounded_rectangle(
            [(card_margin, y_pos), (width - card_margin, y_pos + 50)],
            radius=8, fill=dark_card, outline='#2a2a3e', width=1
        )
        # Gold accent bar
        draw.rectangle([(card_margin, y_pos + 10), (card_margin + 4, y_pos + 40)], fill=gold)
        # Text
        draw.text((card_margin + 18, y_pos + 12), title, fill=white, font=font_body)
        draw.text((width - card_margin - 10, y_pos + 25), year, fill=gold, font=font_small, anchor="rm")
        y_pos += 58
    
    y_pos += 15
    
    # INFLUENCED BY section
    draw.text((60, y_pos), "INFLUENCED BY", fill=gold, font=font_subtitle)
    y_pos += 35
    
    influences = ["Sherwood Anderson", "Mark Twain", "Ezra Pound"]
    x_start = 50
    for influence in influences:
        bbox = draw.textbbox((0, 0), influence, font=font_small)
        tag_width = bbox[2] - bbox[0] + 24
        tag_height = 34
        draw.rounded_rectangle(
            [(x_start, y_pos), (x_start + tag_width, y_pos + tag_height)],
            radius=17, fill='#1e1e2e', outline='#3a3a4e', width=1
        )
        draw.text((x_start + 12, y_pos + tag_height//2), influence, 
                  fill=off_white, font=font_small, anchor="lm")
        x_start += tag_width + 10
    
    y_pos += 50
    
    # INFLUENCED section
    draw.text((60, y_pos), "INFLUENCED", fill=gold, font=font_subtitle)
    y_pos += 35
    
    influenced = ["Raymond Carver", "Cormac McCarthy", "Joan Didion"]
    x_start = 50
    for person in influenced:
        bbox = draw.textbbox((0, 0), person, font=font_small)
        tag_width = bbox[2] - bbox[0] + 24
        tag_height = 34
        draw.rounded_rectangle(
            [(x_start, y_pos), (x_start + tag_width, y_pos + tag_height)],
            radius=17, fill='#1e1e2e', outline='#3a3a4e', width=1
        )
        draw.text((x_start + 12, y_pos + tag_height//2), person, 
                  fill=off_white, font=font_small, anchor="lm")
        x_start += tag_width + 10
    
    y_pos += 60
    
    # Quote section - elegant box
    quote_y = y_pos
    quote_height = 90
    draw.rounded_rectangle(
        [(50, quote_y), (width - 50, quote_y + quote_height)],
        radius=12, fill='#12121a', outline=gold, width=1
    )
    # Left accent
    draw.rectangle([(50, quote_y + 15), (54, quote_y + quote_height - 15)], fill=gold)
    
    quote = '"There is nothing to writing.\nAll you do is sit down at a\ntypewriter and bleed."'
    draw.text((70, quote_y + 18), quote, fill=off_white, font=font_small)
    
    y_pos += quote_height + 25
    
    # Bottom section with lineage info
    draw.rectangle([(60, y_pos), (width - 60, y_pos + 1)], fill='#2a2a3a')
    y_pos += 20
    
    # Footer
    draw.text((60, height - 55), "LINEAGE LIT", fill=gold, font=font_subtitle)
    draw.text((width - 60, height - 52), "Explore the creative DNA →", 
              fill=light_gray, font=font_small, anchor="rm")
    
    # Save
    output_path = Path("/home/spark/.openclaw/workspace/lineage-lit/public/hemingway-card-v2.png")
    img.save(output_path, quality=95)
    
    print(f"✅ Sleek Hemingway card v2 generated!")
    print(f"   Saved to: {output_path}")
    
    return output_path


if __name__ == "__main__":
    create_sleek_hemingway_card()
