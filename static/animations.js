// Advanced Animation System for Linked List Operations
class LinkedListAnimator {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationSpeed = 1000; // ms
        this.isAnimating = false;
    }

    async animateInsertion(list, position, value) {
        this.isAnimating = true;
        
        // Show new node appearing
        await this.showNewNode(value);
        
        // Animate pointer updates
        await this.animatePointerChanges(list, position);
        
        // Final state
        this.drawFinalState(list);
        this.isAnimating = false;
    }

    async animateDeletion(list, position) {
        this.isAnimating = true;
        
        // Highlight node to delete
        await this.highlightNode(position, '#ff4444');
        
        // Animate pointer bypass
        await this.animatePointerBypass(list, position);
        
        // Fade out deleted node
        await this.fadeOutNode(position);
        
        this.isAnimating = false;
    }

    async animateTraversal(list) {
        this.isAnimating = true;
        
        for (let i = 0; i < list.length; i++) {
            await this.highlightNode(i, '#4CAF50');
            await this.sleep(500);
            await this.unhighlightNode(i);
        }
        
        this.isAnimating = false;
    }

    async showNewNode(value) {
        // Animation implementation
        return new Promise(resolve => {
            let opacity = 0;
            const animate = () => {
                this.ctx.save();
                this.ctx.globalAlpha = opacity;
                // Draw new node
                this.ctx.restore();
                
                opacity += 0.1;
                if (opacity <= 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}