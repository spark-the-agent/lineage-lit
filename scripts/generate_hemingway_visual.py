#!/usr/bin/env python3
"""
Generate Hemingway Creative DNA Card Visual
Uses ComfyUI for high-quality image generation
"""

import json
import urllib.request
import urllib.parse
import random
import os
from pathlib import Path

# ComfyUI server (assumes it's running locally)
COMFYUI_URL = "http://127.0.0.1:8188"

def generate_hemingway_card():
    """Generate a visual Hemingway DNA card"""
    
    # The prompt for the card design
    prompt = """A beautiful literary trading card design for Ernest Hemingway, vintage 1920s Paris aesthetic, 
art deco borders in gold and navy blue, aged paper texture background, elegant typography, 
fishing rod and marlin silhouette, typewriter keys subtly integrated into the design, 
"The Sun Also Rises" and "Old Man and the Sea" as book spines on the side, 
Nobel Prize medal icon, connections lines showing literary influence network,
dark blue and gold color palette, sophisticated literary collectible card design,
high detail, professional graphic design"""
    
    # Create workflow for FLUX (fast, high quality)
    workflow = {
        "1": {
            "inputs": {
                "seed": random.randint(1, 2**32),
                "steps": 4,
                "cfg": 1.0,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 1.0,
                "model": ["2", 0],
                "positive": ["3", 0],
                "negative": ["4", 0],
                "latent_image": ["5", 0]
            },
            "class_type": "KSampler"
        },
        "2": {
            "inputs": {"unet_name": "flux1-schnell.safetensors"},
            "class_type": "UNETLoader"
        },
        "3": {
            "inputs": {"text": prompt, "clip": ["6", 0]},
            "class_type": "CLIPTextEncode"
        },
        "4": {
            "inputs": {"text": "blurry, low quality, modern, digital, neon colors, ugly, deformed", "clip": ["6", 0]},
            "class_type": "CLIPTextEncode"
        },
        "5": {
            "inputs": {"width": 1024, "height": 1536, "batch_size": 1},  # Portrait orientation for card
            "class_type": "EmptyLatentImage"
        },
        "6": {
            "inputs": {"clip_name1": "t5xxl_fp16.safetensors", "clip_name2": "clip_l.safetensors", "type": "flux"},
            "class_type": "DualCLIPLoader"
        },
        "7": {
            "inputs": {"samples": ["1", 0], "vae": ["8", 0]},
            "class_type": "VAEDecode"
        },
        "8": {
            "inputs": {"vae_name": "ae.safetensors"},
            "class_type": "VAELoader"
        },
        "9": {
            "inputs": {"filename_prefix": "hemingway_card", "images": ["7", 0]},
            "class_type": "SaveImage"
        }
    }
    
    print("🎨 Generating Hemingway Creative DNA Card...")
    print(f"   Prompt: {prompt[:100]}...")
    
    try:
        # Queue the prompt
        data = json.dumps({"prompt": workflow}).encode('utf-8')
        req = urllib.request.Request(
            f"{COMFYUI_URL}/prompt",
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        response = urllib.request.urlopen(req)
        result = json.loads(response.read())
        
        print(f"✅ Generation queued!")
        print(f"   Prompt ID: {result.get('prompt_id', 'N/A')}")
        print(f"   Check ComfyUI output folder for hemingway_card_*.png")
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n⚠️  Make sure ComfyUI is running:")
        print("   cd /home/spark/.openclaw/workspace/ai-generation/ComfyUI")
        print("   python main.py")
        return None


def generate_simple_card():
    """Generate a simpler card using available tools"""
    
    # Try using FAL or other available APIs
    print("🎨 Attempting to generate Hemingway card...")
    
    # Check if we can use existing image generation
    output_dir = Path("/home/spark/.openclaw/workspace/ai-generation/output")
    output_dir.mkdir(exist_ok=True)
    
    # For now, create a simple HTML-to-image approach or use available tools
    print("💡 To generate the visual card:")
    print("   Option 1: Start ComfyUI and run this script")
    print("   Option 2: Use the HTML card I already created")
    print("   Option 3: Use an online image generation API")
    
    return None


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--simple":
        generate_simple_card()
    else:
        result = generate_hemingway_card()
        
        if result:
            print("\n📝 Next steps:")
            print("   1. Wait for generation to complete (~30 seconds)")
            print("   2. Check ai-generation/ComfyUI/output/ folder")
            print("   3. File will be named: hemingway_card_*.png")
